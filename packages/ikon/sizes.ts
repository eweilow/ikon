import { IconGenerationComponentProps } from "./types";

const startScreen = (
  id: string | undefined,
  name: string,
  width: number,
  height: number,
  pixelRatio: number
) =>
  ({
    id: id != null ? id : `${name}-${width * pixelRatio}-${height * pixelRatio}`,
    name,
    width,
    height,
    pixelRatio,
    type: "splash",
  } as IconGenerationComponentProps);

const iconBaseSize = 128;
const icon = (key: string, name: string, size: number, type: string = "icon") => {
  const startScreenData = startScreen(
    key === "apple-touch-icon.png" || key === "apple-touch-icon-precomposed.png" ? key : undefined,
    name,
    Math.min(iconBaseSize, size),
    Math.min(iconBaseSize, size),
    Math.max(1, size / iconBaseSize)
  );

  return {
    ...startScreenData,
    type,
  } as IconGenerationComponentProps;
};

export const AndroidAppIconSizes: IconGenerationComponentProps[] = [
  icon("android-chrome-36x36.png", "android-chrome", 36),
  icon("android-chrome-48x48.png", "android-chrome", 48),
  icon("android-chrome-72x72.png", "android-chrome", 72),
  icon("android-chrome-96x96.png", "android-chrome", 96),
  icon("android-chrome-144x144.png", "android-chrome", 144),
  icon("android-chrome-192x192.png", "android-chrome", 192),
  icon("android-chrome-256x256.png", "android-chrome", 256),
  icon("android-chrome-384x384.png", "android-chrome", 384),
  icon("android-chrome-512x512.png", "android-chrome", 512),
];

export const DefaultAppIconName = "apple-touch-icon";
export const IOSAppIconSizes: IconGenerationComponentProps[] = [
  icon("apple-touch-icon", "apple-touch-icon", 57),
  icon("apple-touch-icon", "apple-touch-icon", 60),
  icon("apple-touch-icon", "apple-touch-icon", 72),
  icon("apple-touch-icon", "apple-touch-icon", 76),
  icon("apple-touch-icon", "apple-touch-icon", 114),
  icon("apple-touch-icon", "apple-touch-icon", 120),
  icon("apple-touch-icon", "apple-touch-icon", 144),
  icon("apple-touch-icon", "apple-touch-icon", 152),
  icon("apple-touch-icon", "apple-touch-icon", 167),
  icon("apple-touch-icon", "apple-touch-icon", 180),
  icon("apple-touch-icon.png", "apple-touch-icon", 1024),
  icon("apple-touch-icon-precomposed.png", "apple-touch-icon-precomposed", 180),
];

export const FaviconSizes: IconGenerationComponentProps[] = [
  icon("favicon.ico", "favicon", 16, "favicon"),
  icon("favicon.ico", "favicon", 24, "favicon"),
  icon("favicon.ico", "favicon", 32, "favicon"),
  icon("favicon.ico", "favicon", 48, "favicon"),
  icon("favicon.ico", "favicon", 64, "favicon"),
  icon("favicon.ico", "favicon", 72, "favicon"),
  icon("favicon.ico", "favicon", 96, "favicon"),
  icon("favicon.ico", "favicon", 128, "favicon"),
];

export const DefaultLaunchScreenName = "apple-launch-screen-default";

/**
 * https://github.com/itgalaxy/favicons/blob/master/src/platforms/appleStartup.ts#L13-L28
 */
export const IPhoneStartScreens: IconGenerationComponentProps[] = [
  startScreen(undefined, "apple-launch-se", 320, 568, 2), // 4" iPhone SE, iPod touch 5th generation and later
  startScreen(undefined, "apple-launch-8", 375, 667, 2), // iPhone 8, iPhone 7, iPhone 6s, iPhone 6, 4.7" iPhone SE
  startScreen(undefined, "apple-launch-xs", 375, 812, 3), // iPhone 12 mini, iPhone 11 Pro, iPhone XS, iPhone X
  startScreen(undefined, "apple-launch-12", 390, 844, 3), // iPhone 12, iPhone 12 Pro
  startScreen(undefined, "apple-launch-11", 414, 896, 2), // iPhone 11, iPhone XR
  startScreen(undefined, "apple-launch-11-pro-max", 414, 896, 3), // iPhone 11 Pro Max, iPhone XS Max
  startScreen(undefined, "apple-launch-8-plus", 414, 736, 3), // iPhone 8 Plus, iPhone 7 Plus
  startScreen(undefined, "apple-launch-6-plus", 414, 736, 3), // iPhone 6 Plus, iPhone 6s Plus
  startScreen(undefined, "apple-launch-12-pro-max", 428, 926, 3), // iPhone 12 Pro Max
  startScreen(DefaultLaunchScreenName, "apple-launch-8", 376, 667, 3),
];

/**
 * https://github.com/itgalaxy/favicons/blob/master/src/platforms/appleStartup.ts#L13-L28
 */
export const IPadStartScreens: IconGenerationComponentProps[] = [
  startScreen(undefined, "apple-launch-ipad-pro-s", 768, 1024, 2), // 9.7" iPad Pro. 7.9" iPad mini, 9.7" iPad Air, 9.7" iPad
  startScreen(undefined, "apple-launch-ipad-pro", 810, 1080, 2), // 10.2" iPad
  startScreen(undefined, "apple-launch-ipad-pro-l", 834, 1194, 2), // 11" iPad Pro, 10.5" iPad Pro
  startScreen(undefined, "apple-launch-air", 834, 1112, 2), // 10.5" iPad Air
  startScreen(undefined, "apple-launch-ipad-pro-xl", 1024, 1366, 2), // 12.9" iPad Pro
];
