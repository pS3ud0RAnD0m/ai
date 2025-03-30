import { spawn } from 'child_process';
import { config } from 'dotenv';

// Load .env.local explicitly
config({ path: '../.env.local' }); // Adjust path since this is in tests/

const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
if (!hostname) {
    throw new Error('NEXT_PUBLIC_HOSTNAME is not defined in .env.local');
}

const command = `next start --hostname ${hostname}`;

// On Windows, use cmd.exe; on Unix, run directly
const prodServer = process.platform === 'win32'
    ? spawn('cmd.exe', ['/c', command], { stdio: 'inherit', env: { ...process.env } })
    : spawn('next', ['start', '--hostname', hostname], { stdio: 'inherit', env: { ...process.env } });

globalThis.prodServer = prodServer;

export default async function globalSetup() {
    // Optional: Wait for server to start (if needed)
    await new Promise((resolve) => setTimeout(resolve, 1000));
}