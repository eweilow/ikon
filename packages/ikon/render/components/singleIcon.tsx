import React from "react";

import { IconGenerationComponent, IconGenerationComponentProps } from "../../types";

import { Html } from "./html";

export const SingleIcon: React.FC<{
  icon: IconGenerationComponentProps;
  Component: IconGenerationComponent;
}> = (props) => (
  <Html background="transparent">
    <props.Component {...props.icon} />
  </Html>
);
