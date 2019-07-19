import React from "react";

import {
  AndroidAppIconSizes,
  FaviconSizes,
  IOSAppIconSizes,
  IPadStartScreens,
  IPhoneStartScreens
} from "../../sizes";
import { IconGenerationComponent, IconGenerationComponentProps } from "../../types";

import { Html } from "./html";
import { Icons } from "./icons";

const rotate = (icons: IconGenerationComponentProps[]) =>
  icons.map(icon => ({
    ...icon,
    height: icon.width,
    width: icon.height,
    name: icon.name + "-rot"
  }));

export const AllIcons: React.FC<{
  Component: IconGenerationComponent;
}> = props => (
  <Html background="#e0e0e0">
    <style
      dangerouslySetInnerHTML={{
        __html: `.iconWrapper:hover > .icon { transform: translate(-50%, -50%) !important; z-index: 1000; }`
      }}
    />
    <Icons
      Component={props.Component}
      borderRadius={10 / 57}
      scale={1}
      icons={AndroidAppIconSizes}
      title="Android icons"
    />
    <Icons
      Component={props.Component}
      borderRadius={10 / 57}
      scale={1}
      icons={IOSAppIconSizes}
      title="iOS icons"
    />
    <Icons
      Component={props.Component}
      borderRadius={0}
      scale={1}
      icons={FaviconSizes}
      title="Favicons"
    />
    <Icons
      Component={props.Component}
      borderRadius={0}
      scale={1}
      icons={IPhoneStartScreens}
      title="iPhone start screens"
    />
    <Icons
      Component={props.Component}
      borderRadius={0}
      scale={1}
      icons={IPadStartScreens}
      title="iPad start screens"
    />
    <Icons
      Component={props.Component}
      borderRadius={0}
      scale={1}
      icons={rotate(IPhoneStartScreens)}
      title="iPhone start screens (landscape)"
    />
    <Icons
      Component={props.Component}
      borderRadius={0}
      scale={1}
      icons={rotate(IPadStartScreens)}
      title="iPad start screens (landscape)"
    />
  </Html>
);
