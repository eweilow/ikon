import Datauri from "datauri";
import { createServer } from "http";
import { extname, join } from "path";

import { generateTags, IconGenerationComponent } from "@eweilow/ikon";

export function startDevServer(file: string, wantedPort: number) {
  const { attemptStartServer } = require("./start") as typeof import("./start");
  // MUST BE IN LOCAL SCOPE

  require("hot-module-replacement")({
    ignore: /node_modules/
  });

  let Component: IconGenerationComponent = require(file).default;
  let generateIcons: typeof import("@eweilow/ikon").generateIcons = require("@eweilow/ikon")
    .generateIcons;

  (module as any).hot.accept(file, () => {
    console.log("Reloading %s", file);
    Component = require(file).default;
  });

  const server = createServer(async (req, res) => {
    if (req.url === "/tags") {
      try {
        res.write(`<html><body><pre>`);
        await generateTags(
          Component,
          "/generated-icons",
          join(process.cwd(), "./dist/"),
          4,
          tag =>
            res.write(tag.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n")
        );
        res.write(`</pre></body></html>`);
      } catch (err) {
        res.write("<pre>" + err.stack + "</pre>");
      }
    } else if (req.url === "/icons") {
      try {
        res.write(`<html><body>`);
        await generateTags(
          Component,
          "/generated-icons",
          join(process.cwd(), "./dist/"),
          4,
          undefined,
          (name, image) => {
            const outputUri = new Datauri();
            outputUri.format(extname(name), image);

            const src = outputUri.content;

            res.write(`<img src="${src}"/>\n`);
          }
        );
        res.write(`</body></html>`);
      } catch (err) {
        res.write("<pre>" + err.stack + "</pre>");
      }
    } else {
      try {
        const src = await generateIcons(Component);
        res.write(src);
      } catch (err) {
        res.write("<pre>" + err.stack + "</pre>");
      }
    }
    res.end();
  });

  attemptStartServer(() => server, wantedPort)
    .then(({ port }) => {
      if (port !== wantedPort) {
        console.log(
          "Ikon dev server couldn't listen on port %d, listening on port %d instead",
          wantedPort,
          port
        );
      } else {
        console.log("Ikon dev server listening on port %d", port);
      }
      (process as any).send(port);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
