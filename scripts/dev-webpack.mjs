import { spawn } from "node:child_process";

process.env.NEXT_WEBPACK_DEV = "1";

const child = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
