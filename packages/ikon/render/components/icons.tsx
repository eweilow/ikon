import React from "react";

import { IconGenerationComponent, IconGenerationComponentProps } from "../../types";

export const Icons = (props: {
  icons: IconGenerationComponentProps[];
  title: string;
  scale: number;
  borderRadius: number;
  Component: IconGenerationComponent;
}) => (
  <section>
    <h1
      style={{
        textAlign: "center",
        margin: "16px 8px",
      }}
    >
      {props.title}
    </h1>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        textAlign: "center",
      }}
    >
      {props.icons.map((size) => (
        <div
          key={JSON.stringify(size)}
          style={{
            width: props.scale * size.width,
            height: props.scale * size.height + 32,
            margin: 16,
            background: "#f5f5f5",
            borderRadius: 2,
            borderTopLeftRadius: Math.max(2, size.pixelRatio * props.borderRadius * size.width),
            borderTopRightRadius: Math.max(2, size.pixelRatio * props.borderRadius * size.width),
            boxShadow: "0px 2px 12px #0000000f, 0px 2px 4px #0000000d",
            position: "relative",
          }}
          className="iconWrapper"
        >
          <div
            style={{
              position: "absolute",
              top: props.scale * size.height * 0.5,
              left: props.scale * size.width * 0.5,
              transform: ` scale(${props.scale / size.pixelRatio}) translate(-${
                50 * size.pixelRatio
              }%, -${50 * size.pixelRatio}%)`,
              transformOrigin: "center",
              width: size.width * size.pixelRatio,
              height: size.height * size.pixelRatio,
              borderRadius: size.pixelRatio * props.borderRadius * size.width,
              overflow: "hidden",
              pointerEvents: "none",
              boxShadow: "0px 2px 12px #0000000f, 0px 2px 4px #0000000d",
            }}
            className="icon"
          >
            <props.Component {...size} />
          </div>
          <footer
            style={{
              height: 32,
              display: "flex",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              fontSize: 12,
              fontWeight: "bold",
              padding: "0 8px",
            }}
          >
            {size.width !== size.height ? `${size.width}x${size.height}` : size.width}
            {size.pixelRatio > 1 ? " @ " + size.pixelRatio.toFixed(2) + "x" : null}
          </footer>
        </div>
      ))}
    </div>
  </section>
);
