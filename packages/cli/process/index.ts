async function main() {
  const args = JSON.parse(process.env!.IKON_ARGS || "{}");

  if ((process.env.mode as string) === "watch") {
    const { devProcess } = require("../dist/cjs/process/dev");
    await devProcess(args);
  } else if ((process.env.mode as string) === "build") {
    const { buildProcess } = require("../dist/cjs/process/build");
    await buildProcess(args);
  } else if ((process.env.mode as string) === "html") {
    const { htmlProcess } = require("../dist/cjs/process/build");
    await htmlProcess(args);
  } else {
    throw new Error(`Unknown mode: '${process.env.mode}'`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
