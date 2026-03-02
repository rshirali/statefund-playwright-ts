// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

// Helpers to parse env flags cleanly
const flag = (name: string, fallback: boolean) => {
    const v = process.env[name];
    if (v == null) return fallback;
    return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
};

// Support TRACE values like: off | on | on-first-retry | retain-on-failure
const traceMode = () => {
    const v = (process.env.TRACE || '').toLowerCase().trim();
    if (!v) return 'off' as const;
    if (['on', 'true', '1', 'yes'].includes(v)) return 'on' as const;
    if (v === 'on-first-retry') return 'on-first-retry' as const;
    if (v === 'retain-on-failure') return 'retain-on-failure' as const;
    return 'off' as const;
};

// Env-driven toggles (defaults keep your current behavior)
const HEADLESS = flag('HEADLESS', false); // HEADLESS=false npm test
const VIDEO_ON = flag('VIDEO', false); // VIDEO=true npm test
const SHOTS_ON = flag('SCREENSHOT', false); // SCREENSHOT=true npm test
const BASE_URL = process.env.BASE_URL || 'https://www.statefundca.com';

// For presentation/demo purposes only
// Usage: SLOWMO=800 HEADLESS=false npx playwright test --project=chromium --headed
const SLOWMO = Number(process.env.SLOWMO || 0);

export default defineConfig({
    testDir: './tests',
    timeout: 90_000, // per-test timeout (kept)
    retries: 0,
    workers: 4,

    // Global defaults (projects can extend)
    use: {
        baseURL: BASE_URL,
        headless: HEADLESS,
        viewport: { width: 1366, height: 900 },
        actionTimeout: 10_000,
        navigationTimeout: 20_000,

        // Demo slow-mo (applies to browser actions)
        launchOptions: {
            slowMo: SLOWMO,
        },

        // Artifacts (env-controlled)
        trace: traceMode(),
        video: VIDEO_ON ? 'on' : 'off',
        screenshot: SHOTS_ON ? 'on' : 'off',
    },

    expect: {
        timeout: 10_000,
    },

    reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }]],

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1366, height: 900 },
                headless: HEADLESS,
                launchOptions: { slowMo: SLOWMO },
            },
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                viewport: { width: 1366, height: 900 },
                headless: HEADLESS,
                launchOptions: { slowMo: SLOWMO },
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                viewport: { width: 1366, height: 900 },
                headless: HEADLESS,
                launchOptions: { slowMo: SLOWMO },
            },
        },
    ],
});