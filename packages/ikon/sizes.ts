import { IconGenerationComponentProps } from "./types";

// tslint:disable-next-line:no-var-requires
const icons = require("favicons/dist/config/icons.json");

const startScreen = (
  key: string | undefined,
  name: string,
  width: number,
  height: number,
  pixelRatio: number
) =>
  ({
    key:
      key != null
        ? key
        : `${name}-${width * pixelRatio}-${height * pixelRatio}`,
    name,
    width,
    height,
    pixelRatio,
    type: "splash"
  } as IconGenerationComponentProps);

const iconBaseSize = 128;
const icon = (
  key: string,
  name: string,
  size: number,
  type: string = "icon"
) => {
  const startScreenData = startScreen(
    key === "apple-touch-icon.png" || key === "apple-touch-icon-precomposed.png"
      ? key.split(".")[0]
      : undefined,
    name,
    Math.min(iconBaseSize, size),
    Math.min(iconBaseSize, size),
    Math.max(1, size / iconBaseSize)
  );

  return {
    ...startScreenData,
    type
  } as IconGenerationComponentProps;
};

export const AndroidAppIconSizes: IconGenerationComponentProps[] = [
  ...Object.keys(icons.android)
    .map(key => ({ key, ...icons.android[key] }))
    .sort((a, b) => a.width - b.width)
    .map(size => icon(size.key, "android-chrome", size.width))
];

export const DefaultAppIconName = "apple-touch-icon";
export const IOSAppIconSizes: IconGenerationComponentProps[] = [
  ...Object.keys(icons.appleIcon)
    .map(key => ({ key, ...icons.appleIcon[key] }))
    .sort((a, b) => a.width - b.width)
    .map(size => icon(size.key, "apple-touch-icon", size.width)),
  icon(DefaultAppIconName, DefaultAppIconName, 512)
];

export const FaviconSizes: IconGenerationComponentProps[] = [
  icon("favicon.ico", "favicon", 16, "favicon"),
  icon("favicon.ico", "favicon", 24, "favicon"),
  icon("favicon.ico", "favicon", 32, "favicon"),
  icon("favicon.ico", "favicon", 48, "favicon"),
  icon("favicon.ico", "favicon", 64, "favicon"),
  icon("favicon.ico", "favicon", 72, "favicon"),
  icon("favicon.ico", "favicon", 96, "favicon"),
  icon("favicon.ico", "favicon", 128, "favicon")
];

export const DefaultLaunchScreenName = "apple-launch-screen-default";

export const IPhoneStartScreens: IconGenerationComponentProps[] = [
  startScreen(undefined, "apple-launch-xs-max", 414, 896, 3),
  startScreen(undefined, "apple-launch-xr", 414, 896, 2),
  startScreen(undefined, "apple-launch-xs", 375, 812, 3),
  startScreen(undefined, "apple-launch-8-plus", 414, 736, 3),
  startScreen(undefined, "apple-launch-8", 376, 667, 2),
  startScreen(DefaultLaunchScreenName, "apple-launch-8", 376, 667, 3)
];

export const IPadStartScreens: IconGenerationComponentProps[] = [
  startScreen(undefined, "apple-launch-ipad-pro-xl", 1024, 1366, 2),
  startScreen(undefined, "apple-launch-ipad-pro", 834, 1194, 2),
  startScreen(undefined, "apple-launch-ipad-pro-s", 834, 1112, 2),
  startScreen(undefined, "apple-launch-ipad-air", 768, 1024, 2)
];
