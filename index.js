#!/usr/bin/env node

import { parse } from "yaml";
import { readFile, writeFile } from "fs/promises";
import { program } from "commander";

import { generate } from "./lib/generator.js";

program
  .name("solidq")
  .description(
    "A CLI tool for transforming data structures into decentralized, blockchain-backed databases using Solidity"
  )
  .version("0.1.0");

program
  .command("generate", { isDefault: true })
  .description("generate a database from a schema file")
  .argument("<schema>", "data schema in YAML format")
  .argument("<output>", "output file in Solidity format")
  .action(async (input, output) => {
    const text = await readFile(input);
    const schema = parse(text.toString());
    const generated = generate(schema);
    await writeFile(output, generated);
  });

program.parse();
