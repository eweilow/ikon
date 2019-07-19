import { generateIcons } from "@eweilow/ikon";
import { createWriteStream } from "fs";
import { join } from "path";

export async function buildProcess(args: any) {
  const { generateTags } = require("@eweilow/ikon") as typeof import("@eweilow/ikon");

  const Component = require(process.env.iconGenerator as string).default;

  await generateTags(
    Component,
    process.env.publicPath as string,
    process.env.iconsDir as string,
    4,
    tag => (process as any).send(tag)
  );
}

export async function htmlProcess(args: any) {
  const {
    generateTagsHTML,
    generateIconsHTML
  } = require("@eweilow/ikon-devserver") as typeof import("@eweilow/ikon-devserver");

  const Component = require(process.env.iconGenerator as string).default;

  let stream = createWriteStream(join(process.env.outDir as string, "./tags.html"));
  await generateTagsHTML(
    Component,
    chunk => stream.write(chunk),
    process.env.iconsDir as string,
    process.env.publicPath as string
  );
  stream.close();

  stream = createWriteStream(join(process.env.outDir as string, "./icons.html"));
  await generateIconsHTML(
    Component,
    chunk => stream.write(chunk),
    process.env.iconsDir as string,
    process.env.publicPath as string,
    true
  );

  stream = createWriteStream(join(process.env.outDir as string, "./index.html"));
  const src = await generateIcons(Component);
  stream.write(src);
  stream.close();
}
