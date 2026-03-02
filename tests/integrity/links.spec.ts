import { test, expect } from '@playwright/test';
import { collectHrefs, checkLinks } from '../../utils/linkChecker';

test.describe('State Fund (CA) - Link integrity', () => {
  test('@integrity Header links should not be broken', async ({ page, request, baseURL }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hrefs = await collectHrefs(page, 'header');
    expect(hrefs.length, 'Expected at least a few header links').toBeGreaterThan(0);

    // Risk-based:
    // - Validate first-party links hard
    // - Skip/ignore known external domains (login portal, typo'd social links, etc.)
    await checkLinks(request, baseURL!, hrefs, {
      onlySameOrigin: true,
      softExternal: true,
      ignoreDomains: ['portal.scif.com', 'wwww.facebook.com'],
    });
  });

  test('@integrity Footer links (incl PDFs) should not be broken', async ({ page, request, baseURL }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Ensure footer is rendered
    await page.locator('footer').first().scrollIntoViewIfNeeded();

    const hrefs = await collectHrefs(page, 'footer');
    expect(hrefs.length, 'Expected at least a few footer links').toBeGreaterThan(0);

    await checkLinks(request, baseURL!, hrefs, {
      onlySameOrigin: true,
      softExternal: true,
      ignoreDomains: ['portal.scif.com', 'wwww.facebook.com'],
    });
  });
});
