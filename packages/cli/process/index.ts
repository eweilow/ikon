import { devProcess } from "./dev";
import { buildProcess, htmlProcess } from "./build";

async function main() {
  const args = JSON.parse(process.env!.IKON_ARGS || "{}");

  if ((process.env.mode as string) === "watch") {
    await devProcess(args);
  } else if ((process.env.mode as string) === "build") {
    await buildProcess(args);
  } else if ((process.env.mode as string) === "html") {
    await htmlProcess(args);
  } else {
    throw new Error(`Unknown mode: '${process.env.mode}'`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
