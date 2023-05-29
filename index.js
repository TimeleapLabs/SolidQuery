#!/usr/bin/env node

import { parse } from "yaml";
import { readFile, writeFile } from "fs/promises";
import { program } from "commander";

import { generate } from "./lib/generator.js";
import { defaultOptions, version } from "./lib/cli.js";

program
  .name("solidq")
  .description(
    "A CLI tool for transforming data structures into decentralized, blockchain-backed databases using Solidity"
  )
  .version(version);

program
  .command("generate", { isDefault: true })
  .description("generate a database from a schema file")
  .argument("<schema>", "data schema in YAML format")
  .argument("<output>", "output file in Solidity format")
  .option(
    "-c, --contract <name>",
    "name of the generated contract",
    defaultOptions.contractName
  )
  .option(
    "-s, --solidity <name>",
    "solidity version to use",
    defaultOptions.solidityVersion
  )
  .action(async (input, output, options) => {
    const text = await readFile(input);
    const schema = parse(text.toString());
    const generated = generate(schema, options);
    await writeFile(output, generated);
  });

program.parse();
