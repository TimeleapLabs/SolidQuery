import chalk from "chalk";

export const error = (message, exit = true, exitCode = 2) => {
  console.log(chalk.red(message));
  if (exit) {
    process.exit(exitCode);
  }
};
