import { spawn } from "child_process";
import { config } from "dotenv";

config({ path: ".env.local" });

const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
if (!hostname) {
  throw new Error("NEXT_PUBLIC_HOSTNAME is not defined in .env.local");
}

const command = `next dev --hostname ${hostname}`;
const devProcess =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/c", command], { stdio: "inherit" })
    : spawn("next", ["dev", "--hostname", hostname], { stdio: "inherit" });

devProcess.on("exit", (code) => {
  process.exit(code || 0);
});
