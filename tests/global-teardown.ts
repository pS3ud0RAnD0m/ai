export default async function globalTeardown() {
  if (globalThis.prodServer) {
    globalThis.prodServer.kill();
  }
}
