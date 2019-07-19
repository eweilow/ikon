import { fork } from "child_process";
import { dirname, join } from "path";
import prependTransform from "prepend-transform";

export async function bootIconGenerationProcess(
  iconGenerator: string,
  publicPath: string,
  outDir: string,
  iconsDir: string,
  mode: "watch" | "build" | "html",
  args: any,
  verbose: boolean = false
) {
  const script = join(__dirname, "../../process/index.ts");

  if (verbose) {
    console.log("[ikon:master] Forking %s in %s", script, dirname(iconGenerator));
  }
  const worker = fork(script, [], {
    cwd: dirname(iconGenerator),
    env: {
      ...process.env,
      publicPath,
      iconGenerator,
      outDir,
      iconsDir,
      mode,
      NODE_ENV: process.env.NODE_ENV,
      IKON_ARGS: JSON.stringify(args),
      TS_NODE_IGNORE: "false",
      TS_NODE_PROJECT: join(__dirname, "../../process/tsconfig.process.json")
    },
    execArgv: ["-r", require.resolve("ts-node/register")],
    stdio: "pipe"
  });

  let exitCode: number | null = null;
  worker.on("exit", code => {
    exitCode = code;
  });

  if (verbose) {
    worker.stdout!.pipe(prependTransform("[ikon:fork:out] ")).pipe(process.stdout);
    worker.stderr!.pipe(prependTransform("[ikon:fork:err] ")).pipe(process.stdout);
  } else {
    worker.stdout!.pipe(process.stdout);
    worker.stderr!.pipe(process.stdout);
  }

  if (process.stdin && process.stdin.isTTY) {
    process.stdin.pipe(worker.stdin!);
  }

  return new Promise<string[]>((resolve, reject) => {
    function didExit(code: number | null) {
      if (code !== null && code !== 0) {
        return reject(new Error(`Icon build for generator '${iconGenerator}' exited with ${code}`));
      }
      resolve(data);
    }
    if (worker.killed || exitCode !== null) {
      didExit(exitCode);
    }

    const data: string[] = [];
    worker.on("message", message => {
      if (mode === "build") {
        data.push(message);

        if (verbose) {
          console.log("[ikon:master] generated %s", message);
        } else {
          console.log("%d icons built", data.length);
        }

        if (process.send) {
          process.send(message);
        }
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
