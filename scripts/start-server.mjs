import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

// Render sets PORT; the default matches the local Vite API proxy.
const port = Number(process.env.PORT || 8000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a number between 1 and 65535.");
}

// Start from an empty seed on first boot. Leave an existing database untouched.
const database = resolve(process.env.DB_FILE || "data/db.json");
if (!existsSync(database)) {
  mkdirSync(dirname(database), { recursive: true });
  copyFileSync(new URL("../data/db.seed.json", import.meta.url), database);
}

// Use Node to run the installed CLI directly, so startup works in Windows and on Render.
const require = createRequire(import.meta.url);
const packageFile = require.resolve("json-server/package.json");
const cli = join(dirname(packageFile), require(packageFile).bin["json-server"]);
const server = spawn(process.execPath, [cli, database, "--host", "0.0.0.0", "--port", String(port)], {
  stdio: "inherit",
});

// Shut down the API with the launcher and report startup errors to the host.
server.on("error", (error) => {
  console.error("Could not start JSON Server:", error.message);
  process.exitCode = 1;
});
server.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
process.on("SIGTERM", () => server.kill("SIGTERM"));
