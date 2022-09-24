import { promises } from "fs";
import { join, relative } from "path";
import React from "react";
import { DirectoryResult, dir } from "tmp-promise";

import { bundleFiles } from "../bundle";
import { generateTags } from "../tags";

describe("generateTags", () => {
  let tmpDir: DirectoryResult;
  jest.setTimeout(60000);

  beforeEach(async () => {
    tmpDir = await dir({ unsafeCleanup: true });
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  it("renders correctly", async () => {
    const tags: string[] = [];
    const images: { name: string; buffer: Buffer; publicName: string }[] = [];

    await generateTags(
      (props) => {
        const r = Math.floor(props.width % 255);
        const g = Math.floor(props.height % 255);
        const b = Math.floor((props.pixelRatio * 100) % 255);
        return (
          <div
            style={{
              height: "100%",
              width: "100%",
              color: "#" + [r, g, b].map((s) => s.toString(16)).join(""),
              background: "#" + [r, g, b].map((s) => (255 - s).toString(16)).join(""),
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginLeft: -8,
                marginTop: -8,
                height: 16,
                width: 16,
                borderRadius: 8,
                background: "white",
              }}
            />
          </div>
        );
      },
      "/",
      tmpDir.path,
      1,
      (tag) => tags.push(tag),
      (name, buffer, publicName) => images.push({ name, buffer, publicName }),
      false
    );

    await bundleFiles(tags, tmpDir.path);

    expect(await promises.readFile(join(tmpDir.path, "./icons.html"), "utf-8")).toMatchSnapshot(
      "html"
    );
    expect(await promises.readFile(join(tmpDir.path, "./icons.tsx"), "utf-8")).toMatchSnapshot(
      "tsx"
    );
    expect(await promises.readFile(join(tmpDir.path, "./icons.jsx"), "utf-8")).toMatchSnapshot(
      "jsx"
    );
    expect(await promises.readFile(join(tmpDir.path, "./icons.json"), "utf-8")).toMatchSnapshot(
      "json"
    );
  });
});
