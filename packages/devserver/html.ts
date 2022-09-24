import { IconGenerationComponent, generateTags } from "@eweilow/ikon";
import assert from "assert";
import Datauri from "datauri/parser";
import { extname } from "path";

type StreamWriter = (chunk: string) => void;

export async function generateTagsHTML(
  Component: IconGenerationComponent,
  write: StreamWriter,
  outDir: string,
  publicPath: string,
  extraBodyContent: string = "",
  concurrency: number = 4
) {
  write(`<html><body><pre>`);
  await generateTags(
    Component,
    publicPath,
    outDir,
    concurrency,
    (tag) => write(tag.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n"),
    undefined,
    true
  );
  write(`</pre>`);
  write(extraBodyContent);
  write(`</body></html>`);
}

export async function generateIconsHTML(
  Component: IconGenerationComponent,
  write: StreamWriter,
  outDir: string,
  publicPath: string,
  useRealFiles: boolean,
  extraBodyContent: string = "",
  concurrency: number = 4
) {
  write(`<html><body>`);
  await generateTags(
    Component,
    publicPath,
    outDir,
    concurrency,
    undefined,
    (name, image, publicName) => {
      let src!: string;
      if (useRealFiles) {
        src = publicName;
      } else {
        const outputUri = new Datauri();
        outputUri.format(extname(name), image);
        assert(outputUri.content != null);
        src = outputUri.content;
      }

      write(`<img src="${src}"/>\n`);
    },
    true
  );
  write(extraBodyContent);
  write(`</body></html>`);
}
