async function main() {
  const {
    startDevServer
  } = require("../dist/cjs/dev") as typeof import("./dev");
  const {
    generateTags
  } = require("../dist/cjs/tags") as typeof import("./tags");

  if ((process.env.mode as string) === "watch") {
    startDevServer(process.env.iconGenerator as string);
  } else {
    const Component = require(process.env.iconGenerator as string).default;

    await generateTags(
      Component,
      process.env.publicPath as string,
      process.env.outDir as string,
      4,
      tag => (process as any).send(tag)
    );
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
