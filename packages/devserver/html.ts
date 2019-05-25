import { generateTags, IconGenerationComponent } from "@eweilow/ikon";
import Datauri from "datauri";
import { extname } from "path";

type StreamWriter = (chunk: string) => void;

export async function generateTagsHTML(
  Component: IconGenerationComponent,
  write: StreamWriter,
  outDir: string,
  publicPath: string
) {
  write(`<html><body><pre>`);
  await generateTags(
    Component,
    publicPath,
    outDir,
    4,
    tag => write(tag.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n"),
    undefined,
    true
  );
  write(`</pre></body></html>`);
}

export async function generateIconsHTML(
  Component: IconGenerationComponent,
  write: StreamWriter,
  outDir: string,
  publicPath: string,
  useRealFiles: boolean
) {
  write(`<html><body>`);
  await generateTags(
    Component,
    publicPath,
    outDir,
    4,
    undefined,
    (name, image, publicName) => {
      let src!: string;
      if (useRealFiles) {
        src = publicName;
      } else {
        const outputUri = new Datauri();
        outputUri.format(extname(name), image);
        src = outputUri.content;
      }

      write(`<img src="${src}"/>\n`);
    },
    true
  );
  write(`</body></html>`);
}
