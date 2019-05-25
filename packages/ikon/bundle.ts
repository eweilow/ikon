import { promises } from "fs";
import { join } from "path";
import mkdirp from "mkdirp";

export async function bundleFiles(built: string[], outDir: string) {
  mkdirp.sync(outDir);

  let typescript: string[] = [];
  let javascript: string[] = [];
  let icons: any[] = [];

  typescript.push(`import React from "react"`);
  typescript.push(``);
  javascript.push(`import React from "react"`);
  javascript.push(``);
  typescript.push(`const Icons: React.FC = () => (<>`);
  javascript.push(`const Icons = () => (<>`);

  for (const icon of built) {
    const re = /([^\s=]+)=["']([^"']+)["']/g;
    const props: any = {};
    let match: any;
    while ((match = re.exec(icon)) != null) {
      const [, name, value] = match;
      props[name] = value;
    }

    icons.push(props);

    const line = `  <link ${Object.keys(props)
      .map(
        prop =>
          `${prop}=${
            typeof props[prop] === "string"
              ? JSON.stringify(props[prop])
              : `{${JSON.stringify(props[prop])}}`
          }`
      )
      .join(" ")} />`;

    typescript.push(line);
    javascript.push(line);
  }

  typescript.push("</>);");
  typescript.push("");
  typescript.push("export default Icons;");

  javascript.push("</>);");
  javascript.push("");
  javascript.push("export default Icons;");

  await promises.writeFile(join(outDir, "icons.html"), built.join("\n"));
  await promises.writeFile(join(outDir, "icons.tsx"), typescript.join("\n"));
  await promises.writeFile(join(outDir, "icons.jsx"), javascript.join("\n"));
  await promises.writeFile(
    join(outDir, "icons.json"),
    JSON.stringify(icons, null, "  ")
  );
}
