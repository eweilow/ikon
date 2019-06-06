import { FC } from "react";

export type IconGenerationComponentProps = {
  width: number;
  height: number;
  id: string;
  name: string;
  pixelRatio: number;
  type: "icon" | "splash" | "favicon";
};

export type IconGenerationComponent = FC<IconGenerationComponentProps>;
