import { promises } from "fs";
import toIco from "to-ico";

import { IconGenerationComponentProps } from "./types";

export async function generateFavicon(
  icons: IconGenerationComponentProps[],
  filenames: string[]
): Promise<Buffer> {
  const faviconPaths = icons
    .map((icon, i) => ({ icon, path: filenames[i] }))
    .filter(({ icon }) => icon.type === "favicon")
    .map((el) => el.path);

  const favicons = await Promise.all(faviconPaths.map((filePath) => promises.readFile(filePath)));
  const favicon = await toIco(favicons);
  return favicon;
}
