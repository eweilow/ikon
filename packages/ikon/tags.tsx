import { Sema } from "async-sema";
import { existsSync, promises } from "fs";
import hasha from "hasha";
import mkdirp from "mkdirp";
import { cpus } from "os";
import { join } from "path";
import puppeteer, { Browser, Page } from "puppeteer";

import { generateFavicon } from "./favicon";
import { getIcons, renderIcon } from "./render";
import { DefaultAppIconName, DefaultLaunchScreenName } from "./sizes";
import { IconGenerationComponent } from "./types";

export async function generateTags(
  Component: IconGenerationComponent,
  publicPath: string,
  outDir: string,
  maxConcurrency: number,
  onTagCreated?: (tag: string) => void,
  onImageCreated?: (name: string, buffer: Buffer, publicName: string) => void,
  skipBuildIfPossible: boolean = false
) {
  mkdirp.sync(outDir);

  const browsersCount = Math.min(maxConcurrency, Math.max(1, (cpus() || []).length));
  const pagesPerBrowser = 1;

  const sema = new Sema(browsersCount * pagesPerBrowser);
  const pages: Page[] = [];
  const browsers: Browser[] = [];

  let booted: boolean = false;
  let bootPromise!: Promise<void>;
  async function bootPuppeteerIfNeeded() {
    if (booted) {
      return bootPromise;
    }
    async function innerBoot() {
      console.log("Booting %d browsers", browsersCount);

      for (let i = 0; i < browsersCount; i++) {
        const browser = await puppeteer.launch({
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
          timeout: 5000,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--disable-dev-shm-usage",
          ],
          pipe: true,
        });
        browsers.push(browser);

        for (let p = 0; p < pagesPerBrowser; p++) {
          const page = await browser.newPage();
          pages.push(page);
        }
      }
      console.log("Booted %d pages", pages.length);
    }
    bootPromise = innerBoot();
    booted = true;
    await bootPromise;
  }

  const tags: string[] = [];
  function tagDidComplete(tag: string) {
    if (onTagCreated != null) {
      onTagCreated(tag);
    }
    tags.push(tag);
  }

  function imageDidComplete(name: string, buffer: Buffer, publicName: string) {
    if (onImageCreated != null) {
      onImageCreated(name, buffer, publicName);
    }
  }

  try {
    const icons = getIcons();
    const filePaths = await Promise.all(
      icons.map(async (icon) => {
        await sema.acquire();
        try {
          const fileName = join(outDir, icon.id + ".png");

          let src!: Buffer;
          if (skipBuildIfPossible && existsSync(fileName)) {
            src = await promises.readFile(fileName);
          } else {
            await bootPuppeteerIfNeeded();
            const page = pages.shift() as Page;
            try {
              src = await renderIcon(icon, Component, page);
            } finally {
              pages.push(page);
            }
          }

          let hash: string = "";
          if (process.env.NODE_ENV !== "test") {
            hash =
              "?h=" +
              hasha(src, {
                algorithm: "sha1",
                encoding: "hex",
              }).slice(0, 8);
          } else {
            hash = `?h=test`;
          }

          const publicName = `${publicPath}/${icon.id}.png${hash}`;
          await promises.writeFile(fileName, src);
          imageDidComplete(fileName, src, publicName);

          if (icon.type === "splash") {
            tagDidComplete(
              `<link rel="apple-touch-icon" media="(device-width: ${
                icon.width
              }) and (device-height: ${icon.height}) and (orientation: ${
                icon.width < icon.height ? "portrait" : "landscape"
              }) and (-webkit-device-pixel-ratio: ${icon.pixelRatio})" href="${publicName}">`
            );
            if (icon.id === DefaultLaunchScreenName) {
              tagDidComplete(`<link rel="apple-touch-icon" href="${publicName}">`);
            }
          } else {
            if (icon.name.includes("apple")) {
              tagDidComplete(
                `<link rel="apple-touch-icon" sizes="${icon.width * icon.pixelRatio}x${
                  icon.height * icon.pixelRatio
                }" href="${publicName}">`
              );
              if (icon.id === DefaultAppIconName) {
                tagDidComplete(`<link rel="apple-touch-icon" href="${publicName}">`);
              }
            } else {
              tagDidComplete(
                `<link rel="icon" type="image/png" sizes="${icon.width * icon.pixelRatio}x${
                  icon.height * icon.pixelRatio
                }" href="${publicName}">`
              );
            }
          }
          return fileName;
        } finally {
          sema.release();
        }
      })
    );

    const favicon = await generateFavicon(icons, filePaths);
    const faviconName = join(outDir, "favicon.ico");
    await promises.writeFile(faviconName, favicon);

    let faviconHash: string = "";
    if (process.env.NODE_ENV !== "test") {
      faviconHash =
        "?h=" +
        hasha(favicon, {
          algorithm: "sha1",
          encoding: "hex",
        }).slice(0, 8);
    } else {
      faviconHash = `?h=test`;
    }

    tagDidComplete(`<link rel="shortcut icon" href="${publicPath}/favicon.ico${faviconHash}">`);
    imageDidComplete(faviconName, favicon, `${publicPath}/favicon.ico${faviconHash}`);
  } finally {
    for (const browser of browsers) {
      await browser.close();
    }
  }
}
