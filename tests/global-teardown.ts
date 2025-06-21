import treeKill from 'tree-kill';

export default async () => {
  if (globalThis.prodServerPid) {
    const pid = globalThis.prodServerPid;

    await new Promise<void>((resolve) => {
      treeKill(pid, 'SIGTERM', (err) => {
        if (err) console.error('Error killing process tree:', err);
        resolve();
      });
    });
  }

  if (globalThis.prodServer) {
    globalThis.prodServer.kill();
  }
};