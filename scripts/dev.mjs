import { execSync, spawn } from "node:child_process";

const PORT = 3000;

function pidOnPort(port) {
  try {
    if (process.platform === "win32") {
      const out = execSync(`netstat -ano | findstr ":${port} "`, {
        encoding: "utf8",
      });
      for (const line of out.trim().split("\n")) {
        if (!/LISTENING/.test(line)) continue;
        const pid = line.trim().split(/\s+/).at(-1);
        if (pid && pid !== "0") return pid;
      }
      return null;
    }

    return execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim() || null;
  } catch {
    return null;
  }
}

function isNodeProcess(pid) {
  try {
    if (process.platform === "win32") {
      const out = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, {
        encoding: "utf8",
      });
      return /node\.exe/i.test(out);
    }

    const out = execSync(`ps -p ${pid} -o comm=`, { encoding: "utf8" });
    return /node/i.test(out);
  } catch {
    return false;
  }
}

function freePort(port) {
  const pid = pidOnPort(port);
  if (!pid) return;

  if (!isNodeProcess(pid)) {
    console.warn(
      `\n⚠ Port ${port} is used by a non-Node process (PID ${pid}). Stop it manually or use another port.\n`,
    );
    return;
  }

  console.log(`Stopping stale dev server on port ${port} (PID ${pid})…`);
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    } else {
      execSync(`kill -9 ${pid}`, { stdio: "ignore" });
    }
  } catch {
    /* already gone */
  }
}

freePort(PORT);

// Turbopack in dev avoids the Windows webpack HMR cache bug (next.js#91797).
const child = spawn("npx", ["next", "dev", "--turbo", "-p", String(PORT)], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
