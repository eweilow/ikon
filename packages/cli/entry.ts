import { join } from "path";
import yargs from "yargs";

import { handlePromise } from "./handle";

// tslint:disable-next-line:no-var-requires
const { version: packageVersion } = require("../../package.json");

export default yargs
  .version(packageVersion)
  .option("file", {
    alias: "f",
    type: "string",
    description: "The TypeScript file containing the icon component"
  })
  .option("publicPath", {
    alias: "d",
    type: "string",
    description: "The public path that icons are placed under",
    default: "/icons"
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Use verbose logging",
    default: false
  })
  .demandOption("file")
  .command(
    "dev",
    "Start development mode",
    args =>
      args
        .option("port", {
          alias: "p",
          type: "number",
          description: "The port to use",
          default: 4001
        })
        .option("open", {
          type: "boolean",
          description: "Automatically open a browser",
          default: true
        }),
    args => {
      const { bootIconGenerationProcess } = require("./boot");
      handlePromise(
        bootIconGenerationProcess(
          join(process.cwd(), args.file),
          args.publicPath,
          "",
          "",
          "watch",
          { port: args.port, shouldOpen: args.open },
          args.verbose
        )
      );
    }
  )
  .command(
    "build",
    "Build icons",
    args =>
      args
        .option("outDir", {
          alias: "o",
          type: "string",
          description: "The path to write icons to",
          default: "./icons"
        })
        .demandOption("outDir")
        .option("generationDir", {
          alias: "g",
          type: "string",
          description: "The path to write generated files to",
          default: "./generated"
        })
        .demandOption("generationDir"),
    args => {
      const { bootIconGenerationProcess } = require("./boot");
      handlePromise(
        bootIconGenerationProcess(
          join(process.cwd(), args.file),
          args.publicPath,
          join(process.cwd(), args.outDir),
          join(process.cwd(), args.outDir),
          "build",
          {},
          args.verbose
        ).then(built => {
          const { bundleFiles } = require("@eweilow/ikon");
          return bundleFiles(built, join(process.cwd(), args.generationDir));
        })
      );
    }
  )
  .command(
    "export",
    "Build a deployable version of the development server",
    args =>
      args
        .option("iconsDir", {
          alias: "i",
          type: "string",
          description: "The path to write icons into",
          default: "./dist/icons"
        })
        .demandOption("iconsDir")
        .option("outDir", {
          alias: "o",
          type: "string",
          description: "The path to write the build into",
          default: "./dist"
        })
        .demandOption("outDir"),
    args => {
      const { bootIconGenerationProcess } = require("./boot");
      handlePromise(
        bootIconGenerationProcess(
          join(process.cwd(), args.file),
          args.publicPath,
          join(process.cwd(), args.outDir),
          join(process.cwd(), args.iconsDir),
          "html",
          {},
          args.verbose
        )
      );
    }
  )
  .demandCommand().argv;
