export async function buildProcess(args: any) {
  const {
    generateTags
  } = require("@eweilow/ikon") as typeof import("@eweilow/ikon");

  const Component = require(process.env.iconGenerator as string).default;

  await generateTags(
    Component,
    process.env.publicPath as string,
    process.env.outDir as string,
    4,
    tag => (process as any).send(tag)
  );
}
