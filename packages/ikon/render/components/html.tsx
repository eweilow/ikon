import React from "react";

export const Html = (props: React.PropsWithChildren<{ background: string }>) => (
  <html>
    <head>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body { 
            min-height: 100%; 
            width: 100%; 
            margin: 0; 
            padding: 0; 
            background: ${props.background}; 
            color: #696969 
          }`,
        }}
      />
    </head>
    <body>
      <main>{props.children}</main>
    </body>
  </html>
);
