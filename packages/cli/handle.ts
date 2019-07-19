export async function handlePromise(promise: Promise<any>, exit: boolean = true) {
  try {
    await promise;
    const chalk = require("chalk");
    if (exit) {
      setTimeout(() => {
        console.log(chalk.green("Completed!"));
        process.exit(0);
      }, 250);
    }
  } catch (err) {
    const PrettyError = require("pretty-error");
    const handler = new PrettyError();
    handler.skipNodeFiles();
    handler.alias(process.cwd(), "cwd");
    handler.appendStyle({
      "pretty-error > trace > item": {
        marginBottom: 0
      }
    });
    const renderedError = handler.render(err);
    console.error(renderedError);
    setTimeout(() => {
      process.exit(1);
    }, 250);
  }
}
