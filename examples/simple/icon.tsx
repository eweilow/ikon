import React from "react";
import { IconGenerationComponent } from "@eweilow/ikon-cli";

const Component: IconGenerationComponent = props => (
  <div
    style={{ background: "white", color: "red", height: "100%", width: "100%" }}
  >
    {props.name}: {props.width}x{props.height}@
    {(props.pixelRatio * 100).toFixed(0)}%
  </div>
);

export default Component;
