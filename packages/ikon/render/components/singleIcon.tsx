import React from "react";

import { IconGenerationComponent, IconGenerationComponentProps } from "../../types";

import { Html } from "./html";

export const SingleIcon = (props: {
  icon: IconGenerationComponentProps;
  Component: IconGenerationComponent;
}) => (
  <Html background="transparent">
    <props.Component {...props.icon} />
  </Html>
);
