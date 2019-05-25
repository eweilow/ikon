import React from "react";
import { IconGenerationComponent } from "@eweilow/ikon-cli";

const Component: IconGenerationComponent = props => (
  <div
    style={{
      background:
        "linear-gradient(155deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
      color: "#5afd1d",
      fontWeight: "bold",
      height: "100%",
      width: "100%"
    }}
  >
    {props.name}: {props.width}x{props.height}@
    {(props.pixelRatio * 100).toFixed(0)}%
  </div>
);

export default Component;
