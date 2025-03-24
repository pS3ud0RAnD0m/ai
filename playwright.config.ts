import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME;

if (!HOSTNAME) {
    throw new Error("Missing NEXT_PUBLIC_HOSTNAME in .env.local");
}

export default defineConfig({
    testDir: './tests',
    retries: 0,
    timeout: 30_000,
    use: {
        baseURL: `${HOSTNAME}:3000`,
        headless: true,
    },
});