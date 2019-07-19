import { useFileAsDataURL } from "@eweilow/ikon";
import { IconGenerationComponent } from "@eweilow/ikon-cli";
import React from "react";

const Component: IconGenerationComponent = props => {
  const html5 = useFileAsDataURL("./html5.svg");
  const css3 = useFileAsDataURL("./css3.svg");

  return (
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
      {props.id}: {props.width}x{props.height}@
      {(props.pixelRatio * 100).toFixed(0)}%
      <img
        src={html5}
        style={{
          width: 50 * props.pixelRatio,
          maxWidth: props.width <= 64 ? "90%" : "100%",
          position: "relative",
          zIndex: 1
        }}
      />
      <img
        src={css3}
        style={{
          width: 50 * props.pixelRatio,
          maxWidth: props.width <= 64 ? "90%" : "100%",
          position: "relative",
          zIndex: 1
        }}
      />
    </div>
  );
};

export default Component;
