import { test, expect } from '@playwright/test';
import { startNetworkMonitor } from '../../utils/networkMonitor';

test.describe('State Fund (CA) - Network health', () => {
  test('@network Home page should load without failed requests or 4xx/5xx responses', async ({ page }) => {
    const monitor = startNetworkMonitor(page);

    // "networkidle" can hang on modern sites due to long-lived analytics/3rd-party requests.
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 45_000 });

    // Give late analytics pixels a moment (kept small)
    await page.waitForTimeout(1000);

    monitor.stop();
    const { requestFailures, badResponses } = monitor.getFailures();

    // Risk-based filtering:
    // - Fail hard on first-party document/script/xhr/fetch errors
    // - Ignore common 3rd-party marketing pixels and image noise
    const ignoreDomains = [
      'api.zaius.com',
      'siteintercept.qualtrics.com',

      // Docker/headless often aborts analytics pixels; not a site-health issue
      'www.google.com',
      'www.googletagmanager.com',
      'google-analytics.com',
    ];

    const isIgnored = (url: string) => ignoreDomains.some(d => url.includes(d));

    const filteredRequestFailures = requestFailures.filter(f => !isIgnored(f.url));
    const filteredBadResponses = badResponses
      .filter(r => !isIgnored(r.url))
      .filter(r => !['image', 'media', 'font'].includes(r.resourceType));

    expect(
      filteredRequestFailures,
      `requestfailed events (filtered):\n${JSON.stringify(filteredRequestFailures, null, 2)}`
    ).toEqual([]);
    expect(
      filteredBadResponses,
      `4xx/5xx responses (filtered):\n${JSON.stringify(filteredBadResponses, null, 2)}`
    ).toEqual([]);
  });
});
