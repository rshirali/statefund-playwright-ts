import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
    ...base,
    // Use the logger you already have
    globalSetup: './utils/printResolvedConfig.ts',
});
