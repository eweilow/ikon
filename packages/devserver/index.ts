import { createServer } from "http";

import { generateTagsHTML, generateIconsHTML } from "./html";

export { generateTagsHTML, generateIconsHTML };

import { IconGenerationComponent } from "@eweilow/ikon";
import { join } from "path";
import open from "open";

export function startDevServer(file: string, wantedPort: number) {
  const { attemptStartServer } = require("./start") as typeof import("./start");

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

  const publicPath = "/icons";
  const outDir = join(process.cwd(), "./dist/");

  const server = createServer(async (req, res) => {
    if (req.url === "/tags") {
      try {
        await generateTagsHTML(
          Component,
          chunk => res.write(chunk),
          outDir,
          publicPath
        );
      } catch (err) {
        res.write("<html><body><pre>" + err.stack + "</pre></body></html>");
      }
    } else if (req.url === "/icons") {
      try {
        await generateIconsHTML(
          Component,
          chunk => res.write(chunk),
          outDir,
          publicPath,
          false
        );
      } catch (err) {
        res.write("<html><body><pre>" + err.stack + "</pre></body></html>");
      }
    } else if (req.url === "/real-icons") {
      try {
        await generateIconsHTML(
          Component,
          chunk => res.write(chunk),
          outDir,
          publicPath,
          true
        );
      } catch (err) {
        res.write("<html><body><pre>" + err.stack + "</pre></body></html>");
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
    .then(async ({ port }) => {
      if (port !== wantedPort) {
        console.log(
          "Ikon dev server couldn't listen on port %d, listening on port %d instead",
          wantedPort,
          port
        );
      } else {
        console.log("Ikon dev server listening on port %d", port);
      }

      if (shouldOpen) {
        await open("http://localhost:" + port, {
          wait: true
        });
      }

      (process as any).send(port);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
