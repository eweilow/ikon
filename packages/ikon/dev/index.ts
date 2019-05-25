import Datauri from "datauri";
import { createServer } from "http";
import { extname, join } from "path";
import React from "react";

import { generateTags } from "../tags";
import { IconGenerationComponentProps } from "../types";

export function startDevServer(file: string) {
  const { attemptStartServer } = require("./start") as typeof import("./start");
  // MUST BE IN LOCAL SCOPE

  require("hot-module-replacement")({
    ignore: /node_modules/
  });

  let Component: React.ReactType<IconGenerationComponentProps> = require(file)
    .default;
  let generateIcons: typeof import("../render").generateIcons = require("./render")
    .generateIcons;
  (module as any).hot.accept(file, () => {
    console.log("Reloading %s", file);
    Component = require(file).default;
  });
  (module as any).hot.accept("./render", () => {
    console.log("Reloading %s", "./render");
    generateIcons = require("./render").generateIcons;
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

  attemptStartServer(() => server, 4001)
    .then(({ port }) => {
      console.log("Dev server listening on port %d", port);
      (process as any).send(port);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
