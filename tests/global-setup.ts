import { spawn } from "child_process";

const prodServer = spawn("node", ["--inspect", "./node_modules/next/dist/bin/next", "start"], {
    stdio: "inherit",
    env: { ...process.env },
});

globalThis.prodServer = prodServer;

export default async function globalSetup() {
}
