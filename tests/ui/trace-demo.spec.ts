import { test, expect } from '@playwright/test';

/**
 * Rajeev - Run with TRACE=true and intentionally fail to open trace viewer.
 * Example:
 *   TRACE=true SCREENSHOT=true VIDEO=true npx playwright test tests/ui/trace-demo.spec.ts
 * Then:
 *   npx playwright show-trace <path-to-trace.zip>
 */
test.describe('Trace demo', () => {
  test('Intentional failure to demonstrate trace viewer', async ({ page }) => {
    test.skip(!process.env.TRACE_DEMO, 'Set TRACE_DEMO=1 to run the intentional failure');

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Intentionally wrong assertion — replace with something meaningful if you prefer.
    await expect(page.getByRole('heading', { name: 'THIS SHOULD NOT EXIST' })).toBeVisible();
  });
});
