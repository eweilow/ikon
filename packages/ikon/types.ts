import { ReactType } from "react";

export type IconGenerationComponentProps = {
  width: number;
  height: number;
  key: string;
  name: string;
  pixelRatio: number;
  type: "icon" | "splash" | "favicon";
};

export type IconGenerationComponent = ReactType<IconGenerationComponentProps>;
