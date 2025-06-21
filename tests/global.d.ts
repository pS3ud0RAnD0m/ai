export {};

import type { ChildProcess } from 'child_process';

declare global {
  var prodServer: ChildProcess | undefined;
  var prodServerPid: number | undefined;
}