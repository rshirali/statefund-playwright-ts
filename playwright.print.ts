import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
    ...base,
    // Use the logger from the config
    globalSetup: './utils/printResolvedConfig.ts',
});
