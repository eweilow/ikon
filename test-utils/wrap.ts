import { ChildProcess, spawn } from "child_process";
import { join } from "path";

export function wrapCommand<T extends { [key: string]: string }>(cmd: string, cwd: string, env: T) {
  let childProcess: ChildProcess | null = null;

  function start() {
    const nodeExec = process.env.npm_node_execpath || process.execPath;
    console.log([join(__dirname, "../packages/cli/cli.js"), ...cmd.split(" ")]);
    childProcess = spawn(nodeExec, [join(__dirname, "../packages/cli/cli.js"), ...cmd.split(" ")], {
      cwd,
      env,
    });
  }

  function stopped() {
    return new Promise<void>((resolve, reject) => {
      if (childProcess == null) {
        return resolve();
      }

      childProcess.on("error", (err) => reject(err));

      childProcess.on("exit", (code) => {
        childProcess = null;

        if (code === 0) {
          resolve();
        } else {
          reject(new Error("Child exited with code " + (code || "null")));
        }
      });
    });
  }

  async function stop() {
    if (childProcess == null) {
      throw new Error("childProcess is null!");
    }
    const onStopped = stopped();
    childProcess.kill();
    await onStopped;
  }

  type PipeFn<TPipe> = (msg: TPipe) => void;

  let currentOutFn: PipeFn<any>;
  let currentErrFn: PipeFn<any>;
  return {
    start,
    stop,
    async wait(forStr: string) {
      if (childProcess == null) {
        throw new Error("childProcess is null!");
      }
      return new Promise<void>((resolve, reject) => {
        const listener = (data) => {
          if (data.toString().indexOf(forStr) >= 0) {
            childProcess?.stdout?.off("data", listener);
            resolve();
          }
        };
        childProcess?.stdout?.on("data", listener);
        childProcess?.on("exit", (code) => {
          if (code !== 0) {
            reject("Exited with code " + code);
          }
        });
      });
    },
    pipe(out: PipeFn<string>, err: PipeFn<string>) {
      if (childProcess == null) {
        throw new Error("childProcess is null!");
      }

      currentOutFn = (data) => {
        out(data.toString());
        console.log(data.toString());
      };
      currentErrFn = (data) => {
        err(data.toString());
        console.error(data.toString());
      };
      childProcess?.stdout?.on("data", currentOutFn);
      childProcess?.stderr?.on("data", currentErrFn);
    },
    unpipe() {
      childProcess?.stdout?.off("data", currentOutFn);
      childProcess?.stderr?.off("data", currentErrFn);
    },
    stopped,
  };
}
