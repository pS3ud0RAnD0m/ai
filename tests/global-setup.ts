import { spawn } from 'child_process';
import { config } from 'dotenv';

// Load .env.local explicitly
config({ path: '../.env.local' });

const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
if (!hostname) {
    throw new Error('NEXT_PUBLIC_HOSTNAME is not defined in .env.local');
}

const command = `next start --hostname ${hostname}`;
const prodServer = process.platform === 'win32'
    ? spawn('cmd.exe', ['/c', command], { stdio: 'inherit', env: { ...process.env } })
    : spawn('next', ['start', '--hostname', hostname], { stdio: 'inherit', env: { ...process.env } });

// Store PID for Windows cleanup
if (process.platform === 'win32') {
    prodServer.on('spawn', () => {
        import('tree-kill').then((treeKill) => {
            globalThis.prodServerPid = prodServer.pid; // cmd.exe PID
            // tree-kill will handle killing the full process tree
        });
    });
}

globalThis.prodServer = prodServer;

export default async function globalSetup() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
}