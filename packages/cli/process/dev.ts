export async function devProcess(args: any) {
  const {
    startDevServer
  } = require("@eweilow/ikon-devserver/dist/cjs") as typeof import("@eweilow/ikon-devserver");
  startDevServer(process.env.iconGenerator as string, args.port, args.shouldOpen);
}
