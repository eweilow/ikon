import { fork } from "child_process";
import { dirname, join } from "path";
import prependTransform from "prepend-transform";

export async function bootIconGenerationProcess(
  iconGenerator: string,
  publicPath: string,
  outDir: string,
  mode: "watch" | "build"
) {
  const script = join(__dirname, "../../src/process.ts");

  console.log("Forking %s in %s", script, dirname(iconGenerator));
  const worker = fork(script, [], {
    cwd: dirname(iconGenerator),
    env: {
      ...process.env,
      publicPath,
      iconGenerator,
      outDir,
      mode,
      NODE_ENV: process.env.NODE_ENV,
      TS_NODE_IGNORE: "false",
      TS_NODE_PROJECT: join(__dirname, "../../tsconfig.process.json")
    },
    execArgv: ["-r", require.resolve("ts-node/register")],
    stdio: "pipe"
  });

  let exitCode: number | null = null;
  worker.on("exit", code => {
    exitCode = code;
  });

  worker.stdout!.pipe(prependTransform("[icons:out] ")).pipe(process.stdout);
  worker.stderr!.pipe(prependTransform("[icons:err] ")).pipe(process.stderr);
  process.stdin.pipe(worker.stdin!);

  return new Promise<string[]>((resolve, reject) => {
    function didExit(code: number | null) {
      if (code !== null && code !== 0) {
        return reject(
          new Error(
            `Icon build for generator '${iconGenerator}' exited with ${code}`
          )
        );
      }
      resolve(data);
    }
    if (worker.killed || exitCode !== null) {
      didExit(exitCode);
    }

    const data: string[] = [];
    worker.on("message", message => {
      data.push(message);

      console.log(" - %s", message);

      if (process.send) {
        process.send(message);
      }
    });
    worker.on("error", err => {
      reject(err);
    });
    worker.on("close", code => {
      didExit(code);
    });
    worker.on("exit", code => {
      didExit(code);
    });
  });
}
