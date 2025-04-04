#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cwd = process.cwd();
const command = process.argv[2];
const componentName = process.argv[3];

const log = console.log;

switch (command) {
  case "init":
    setupTailwind();
    break;

  case "add":
    if (!componentName) {
      log(
        chalk.red("❌ Please specify a component: brainy add <component-name>")
      );
      process.exit(1);
    }
    addComponent(componentName);
    break;

  default:
    log(
      chalk.red(
        "❌ Unknown command. Try `brainy init` or `brainy add password-analyzer`"
      )
    );
    break;
}

function setupTailwind() {
  const tailwindPath = path.join(cwd, "tailwind.config.js");

  if (!fs.existsSync(tailwindPath)) {
    log(chalk.yellow("⚠️ No tailwind.config.js found."));
    log(chalk.gray("Assuming you're using Tailwind CSS v4 with zero-config."));
    log(
      chalk.gray(
        "If you customize Tailwind later, add Brainy UI paths manually:"
      )
    );
    log(chalk.cyan(`  "./node_modules/brainy-ui/**/*.{js,ts,jsx,tsx}"`));
    return;
  }

  let config = fs.readFileSync(tailwindPath, "utf-8");
  const importPath = `"./node_modules/brainy-ui/**/*.{js,ts,jsx,tsx}",`;

  if (!config.includes(importPath)) {
    config = config.replace("content: [", `content: [\n    ${importPath}`);
    fs.writeFileSync(tailwindPath, config, "utf-8");
    log(chalk.green("✅ Tailwind config updated with Brainy UI paths."));
  } else {
    log(chalk.gray("ℹ️ Tailwind config already includes Brainy UI paths."));
  }

  log(chalk.greenBright("\n✨ Brainy UI setup complete. Happy building!"));
}

function addComponent(name) {
  const supported = ["password-analyzer"];

  if (!supported.includes(name)) {
    log(chalk.red(`❌ Unknown component "${name}".`));
    log(chalk.yellow("ℹ️ Try one of: " + supported.join(", ")));
    process.exit(1);
  }

  const sourceDir = path.join(__dirname, `../snippets/${name}`);
  if (!fs.existsSync(sourceDir)) {
    log(chalk.red(`❌ Snippet directory not found: ${sourceDir}`));
    process.exit(1);
  }

  const files = fs.readdirSync(sourceDir);
  const tsxFile = files.find((file) => file.endsWith(".tsx"));

  if (!tsxFile) {
    log(chalk.red(`❌ No .tsx component found in ${sourceDir}`));
    process.exit(1);
  }

  const sourceFile = path.join(sourceDir, tsxFile);
  const targetDir = path.join(cwd, "src", "components");

  fs.ensureDirSync(targetDir);
  fs.copyFileSync(sourceFile, path.join(targetDir, tsxFile));

  log(chalk.green(`✅ Added ${name} to ./src/components/${tsxFile}`));
  log(chalk.cyan(`💡 Import it using:`));
  log(
    chalk.gray(
      `   import ${tsxFile.replace(".tsx", "")} from "@/components/${tsxFile}"`
    )
  );

  if (name === "password-analyzer") {
    log("");
    log(chalk.magenta("📦 Heads up!"));
    log(
      chalk.gray(
        `   This component relies on UI elements from shadcn/ui. Make sure you have:`
      )
    );
    log(chalk.yellow("   - Input"));
    log(chalk.yellow("   - Popover"));
    log(chalk.yellow("   - Label"));
    log(
      chalk.gray(
        `   Install them via:` +
          chalk.cyan(" npx shadcn-ui@latest add input popover label")
      )
    );
  }
}
