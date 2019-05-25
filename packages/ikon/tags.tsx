import { Sema } from "async-sema";
import { promises } from "fs";
import hasha from "hasha";
import { cpus } from "os";
import { join } from "path";
import puppeteer, { Browser, Page } from "puppeteer";

import { generateFavicon } from "./favicon";
import { DefaultAppIconName, DefaultLaunchScreenName } from "./sizes";
import { IconGenerationComponent } from "./types";
import { renderIcon, getIcons } from "./render";

export async function generateTags(
  Component: IconGenerationComponent,
  publicPath: string,
  outDir: string,
  maxConcurrency: number,
  onTagCreated?: (tag: string) => void,
  onImageCreated?: (name: string, buffer: Buffer) => void
) {
  const browsers: Browser[] = [];

  const browsersCount = Math.min(
    maxConcurrency,
    Math.max(1, (cpus() || []).length)
  );
  const pagesPerBrowser = 1;

  console.log("Booting %d browsers", browsersCount);

  const sema = new Sema(browsersCount * pagesPerBrowser);
  const pages: Page[] = [];
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
        "--disable-dev-shm-usage"
      ],
      pipe: true
    });
    browsers.push(browser);

    for (let p = 0; p < pagesPerBrowser; p++) {
      const page = await browser.newPage();
      pages.push(page);
    }
  }
  console.log("Booted %d pages", pages);

  const tags: string[] = [];
  function tagDidComplete(tag: string) {
    if (onTagCreated != null) {
      onTagCreated(tag);
    }
    tags.push(tag);
  }

  function imageDidComplete(name: string, buffer: Buffer) {
    if (onImageCreated != null) {
      onImageCreated(name, buffer);
    }
  }

  try {
    const icons = getIcons();
    const filePaths = await Promise.all(
      icons.map(async icon => {
        await sema.acquire();
        const page = pages.shift() as Page;
        try {
          const src = await renderIcon(icon, Component, page);
          const fileName = join(outDir, icon.key + ".png");
          await promises.writeFile(fileName, src);
          imageDidComplete(fileName, src);

          const hash =
            "?h=" +
            hasha(src, {
              algorithm: "sha1",
              encoding: "hex"
            }).slice(0, 8);

          if (icon.type === "splash") {
            tagDidComplete(
              `<link rel="apple-touch-icon" media="(device-width: ${
                icon.width
              }) and (device-height: ${icon.height}) and (orientation: ${
                icon.width < icon.height ? "portrait" : "landscape"
              }) and (-webkit-device-pixel-ratio: ${
                icon.pixelRatio
              })" href="${publicPath}/${icon.key}.png${hash}">`
            );
            if (icon.key === DefaultLaunchScreenName) {
              tagDidComplete(
                `<link rel="apple-touch-icon" href="${publicPath}/${
                  icon.key
                }.png${hash}">`
              );
            }
          } else {
            if (icon.name.includes("apple")) {
              tagDidComplete(
                `<link rel="apple-touch-icon" sizes="${icon.width *
                  icon.pixelRatio}x${icon.height *
                  icon.pixelRatio}" href="${publicPath}/${
                  icon.key
                }.png${hash}">`
              );
              if (icon.key === DefaultAppIconName) {
                tagDidComplete(
                  `<link rel="apple-touch-icon" href="${publicPath}/${
                    icon.key
                  }.png${hash}">`
                );
              }
            } else {
              tagDidComplete(
                `<link rel="icon" type="image/png" sizes="${icon.width *
                  icon.pixelRatio}x${icon.height *
                  icon.pixelRatio}" href="${publicPath}/${
                  icon.key
                }.png${hash}">`
              );
            }
          }
          return fileName;
        } finally {
          sema.release();
          pages.push(page);
        }
      })
    );

    const favicon = await generateFavicon(icons, filePaths);
    const faviconName = join(outDir, "favicon.ico");
    await promises.writeFile(faviconName, favicon);

    const faviconHash =
      "?h=" +
      hasha(favicon, {
        algorithm: "sha1",
        encoding: "hex"
      }).slice(0, 8);

    tagDidComplete(
      `<link rel="shortcut icon" href="${publicPath}/favicon.ico${faviconHash}">`
    );
    imageDidComplete(faviconName, favicon);
  } finally {
    for (const browser of browsers) {
      await browser.close();
    }
  }
}
