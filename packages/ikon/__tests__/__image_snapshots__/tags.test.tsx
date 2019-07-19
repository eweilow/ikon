import { existsSync } from "fs";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { basename, join } from "path";
import React from "react";
import { DirectoryResult, dir } from "tmp-promise";

import { generateTags } from "../tags";

expect.extend({ toMatchImageSnapshot });

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

    for (const image of images) {
      const fileName = basename(image.name);
      if (fileName.endsWith(".ico")) {
        continue;
      }
      expect(image.buffer).toMatchImageSnapshot({
        customSnapshotIdentifier: fileName
      });

      expect(existsSync(join(tmpDir.path, fileName))).toBe(true);
    }

    expect(tags).toMatchSnapshot("tags");
  });
});
