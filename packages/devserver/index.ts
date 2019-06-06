import { createServer } from "http";

import { generateTagsHTML, generateIconsHTML } from "./html";
export { generateTagsHTML, generateIconsHTML };

import { IconGenerationComponent } from "@eweilow/ikon";
import { join, dirname } from "path";
import open from "open";
import { EventEmitter } from "events";
import { watchFile, unwatchFile, watch, FSWatcher } from "fs";

export function startDevServer(
  file: string,
  wantedPort: number,
  shouldOpen: boolean = true
) {
  const dir = dirname(file);
  require("hot-module-replacement")({
    ignore: (s: string) => {
      if (s.startsWith(dir)) {
        return false;
      }
      return true;
    }
  });

  const { attemptStartServer } = require("./start") as typeof import("./start");

  let Component: IconGenerationComponent = require(file).default;
  let ikon: typeof import("@eweilow/ikon") = require("@eweilow/ikon");
  const { generateIcons, mediaEvents } = ikon;

  const hotEvents = new EventEmitter();
  const listeners = new Map<string, FSWatcher>();
  mediaEvents.on("reset", args => {
    if (listeners.has(args)) {
      listeners.get(args)!.close();
    }
    listeners.delete(args);
  });

  const throttledEvents = new Set<string>();
  mediaEvents.on("load", args => {
    if (!listeners.has(args)) {
      function listener(event: string, filename: string) {
        if (event === "change") {
          if (throttledEvents.has(filename)) {
            return;
          }
          throttledEvents.add(filename);
          setTimeout(() => {
            throttledEvents.delete(filename);
            hotEvents.emit("hot", file);
          }, 100);
        }
      }
      listeners.set(args, watch(args, listener));
    }
  });

  if ((module as any).hot) {
    (module as any).hot.accept(file, () => {
      hotEvents.emit("hot", file);
      Component = require(file).default;
    });
  }

  hotEvents.on("hot", args => {
    console.log("Reloading %s", args);
  });

  const publicPath = "/icons";
  const outDir = join(process.cwd(), "./dist/");

  const headTag =
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Ikon development server</title></head>';
  const hotReloadTag = '<script src="reload.js"></script>';
  const hotReloadScript = `
    const eventSource = new EventSource("/poll");
    eventSource.onmessage = function(event) {
      if(event.data === "reload") {
      console.log(event);
      location.reload();
      }
    }
  `;

  const server = createServer(async (req, res) => {
    if (req.url === "/reload.js") {
      res.writeHead(200, {
        "Content-Type": "text/javascript",
        "Cache-Control": "no-cache"
      });
      res.write(hotReloadScript);
      res.end();
    } else if (req.url === "/poll") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      });
      res.write("\n");
      function listener() {
        if (res.finished) {
          return;
        }
        res.write("data: reload\n\n");
      }
      hotEvents.addListener("hot", listener);
      req.on("close", () => {
        hotEvents.removeListener("hot", listener);
      });
    } else if (req.url === "/tags") {
      try {
        await generateTagsHTML(
          Component,
          chunk => res.write(chunk),
          outDir,
          publicPath,
          hotReloadTag
        );
      } catch (err) {
        res.write(
          "<html>" +
            headTag +
            "<body><pre>" +
            err.stack +
            "</pre>" +
            hotReloadTag +
            "</body></html>"
        );
      }
      res.end();
    } else if (req.url === "/icons") {
      try {
        await generateIconsHTML(
          Component,
          chunk => res.write(chunk),
          outDir,
          publicPath,
          false,
          hotReloadTag
        );
      } catch (err) {
        res.write(
          "<html>" +
            headTag +
            "<body><pre>" +
            err.stack +
            "</pre>" +
            hotReloadTag +
            "</body></html>"
        );
      }
      res.end();
    } else if (req.url === "/real-icons") {
      try {
        await generateIconsHTML(
          Component,
          chunk => res.write(chunk),
          outDir,
          publicPath,
          true,
          hotReloadTag
        );
      } catch (err) {
        res.write(
          "<html>" +
            headTag +
            "<body><pre>" +
            err.stack +
            "</pre>" +
            hotReloadTag +
            "</body></html>"
        );
      }
      res.end();
    } else if (req.url === "/") {
      try {
        const src = await generateIcons(Component);
        res.write(
          src
            .replace("</body>", hotReloadTag + "</body>")
            .replace("<html>", "<html>" + headTag)
        );
      } catch (err) {
        res.write("<pre>" + err.stack + "</pre>");
      }
      res.end();
    } else if (req.url === "/favicon.ico") {
      res.statusCode = 404;
      res.end();
    }
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
