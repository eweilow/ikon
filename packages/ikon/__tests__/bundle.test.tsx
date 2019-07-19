import { promises } from "fs";
import { join } from "path";
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
    const images: Array<{ name: string; buffer: Buffer; publicName: string }> = [];

    await generateTags(
      props => (
        <div
          style={{
            height: "100%",
            width: "100%",
            color: "red",
            background: "green",
            textAlign: "center"
          }}
        >
          this is a test! size: {props.width}x{props.height} at {props.pixelRatio}
        </div>
      ),
      "/",
      tmpDir.path,
      1,
      tag => tags.push(tag),
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
