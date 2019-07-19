import { format } from "prettier";
import React from "react";

import { generateIcons } from "../render";

describe("generateIcons", () => {
  it("renders HTML correctly", async () => {
    const html = await generateIcons(props => {
      const r = Math.floor(props.width % 255);
      const g = Math.floor(props.height % 255);
      const b = Math.floor((props.pixelRatio * 100) % 255);
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            color: "#" + [r, g, b].map(s => s.toString(16)).join(""),
            background: "#" + [r, g, b].map(s => (255 - s).toString(16)).join(""),
            textAlign: "center"
          }}
        >
          this is a test! size: {props.width}x{props.height} at {props.pixelRatio}
        </div>
      );
    });

    expect(format(html, { parser: "html" })).toMatchSnapshot();
  });
});
