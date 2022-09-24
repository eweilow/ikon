import React from "react";
import { DirectoryResult, dir } from "tmp-promise";

import { generateIconsHTML } from "../html";

describe("generateIconsHTML", () => {
  let tmpDir: DirectoryResult;
  jest.setTimeout(60000);

  beforeEach(async () => {
    tmpDir = await dir({ unsafeCleanup: true });
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  it("renders correctly", async () => {
    const file: string[] = [];
    await generateIconsHTML(
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
      (chunk) => file.push(chunk),
      tmpDir.path,
      "/",
      true,
      "",
      1
    );

    expect(file.join("\n")).toMatchSnapshot();
  });
});
