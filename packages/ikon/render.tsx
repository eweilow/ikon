import Datauri from "datauri";
import { Page } from "puppeteer";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";

import { resetMediaCache } from "./media";
import { AllIcons } from "./render/components/allIcons";
import { SingleIcon } from "./render/components/singleIcon";
import {
  AndroidAppIconSizes,
  FaviconSizes,
  IOSAppIconSizes,
  IPadStartScreens,
  IPhoneStartScreens
} from "./sizes";
import { IconGenerationComponent, IconGenerationComponentProps } from "./types";

export async function generateIcons(Component: IconGenerationComponent) {
  resetMediaCache();
  return renderToStaticMarkup(<AllIcons Component={Component} />);
}

export function getIcons() {
  return [
    ...FaviconSizes,
    ...AndroidAppIconSizes,
    ...IOSAppIconSizes,
    ...IPhoneStartScreens,
    ...IPadStartScreens
  ];
}

export async function generateIcon(
  icon: IconGenerationComponentProps,
  Component: IconGenerationComponent
) {
  resetMediaCache();
  return renderToStaticMarkup(<SingleIcon icon={icon} Component={Component} />);
}

export async function renderIcon(
  icon: IconGenerationComponentProps,
  Component: IconGenerationComponent,
  page: Page
) {
  const data = await generateIcon(icon, Component);

  const datauri = new Datauri();
  datauri.format(".html", data);

  const realWidth = icon.width * icon.pixelRatio;
  let superSampling: number = 1;
  if (icon.pixelRatio === 1 && realWidth < 512) {
    superSampling = 4;
  } else if (icon.pixelRatio === 2 && realWidth < 512) {
    superSampling = 2;
  }
  await page.goto(datauri.content);
  await page.setViewport({
    width: icon.width * icon.pixelRatio,
    height: icon.height * icon.pixelRatio,
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: superSampling
  });

  const src = await page.screenshot({
    fullPage: true,
    encoding: "binary",
    omitBackground: true,
    type: "png"
  });
  const resized =
    superSampling !== 1
      ? await sharp(src)
          .resize(icon.width * icon.pixelRatio, icon.height * icon.pixelRatio)
          .toBuffer()
      : src;

  return resized;
}
