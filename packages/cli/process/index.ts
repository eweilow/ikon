import { devProcess } from "./dev";
import { buildProcess } from "./build";

async function main() {
  const args = JSON.parse(process.env!.IKON_ARGS || "{}");

  if ((process.env.mode as string) === "watch") {
    await devProcess(args);
  } else {
    await buildProcess(args);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
