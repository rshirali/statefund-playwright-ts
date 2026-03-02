import { test, expect } from '@playwright/test';
import { StateFundHomePage } from '../../src/pages/StateFundHomePage';

/**
 * A resilient navigation smoke test:
 * - Finds a handful of internal links from the header/nav
 * - Clicks them and asserts the page has a heading
 *
 * This avoids hardcoding labels that may change, while still proving real navigation works.
 */
test.describe('State Fund (CA) - Navigation smoke', () => {
  test('@smoke Top navigation links navigate to real content (named links)', async ({ page }) => {
    const home = new StateFundHomePage(page);
    await home.open('/');

    const navTargets: Array<{ label: string; path: RegExp }> = [
      { label: 'For Brokers', path: /\/broker\/?$/ },
      { label: 'For Medical Providers', path: /\/medical-provider\/?$/ },
      { label: 'About Us', path: /\/about\/?$/ },
      { label: 'Work Comp Basics', path: /\/workers-compensation-basics\/?$/ },
      { label: 'Contact', path: /\/contact-us\/?$/ },
    ];

    for (const target of navTargets) {
      await test.step(`Click nav link: ${target.label}`, async () => {
        await home.topNavLink(target.label).first().click();
        await expect(page, `URL should match expected path after clicking ${target.label}`).toHaveURL(target.path);
        // Some pages don't use an H1 (content-managed sites can vary). Require a main landmark + a visible heading.
        await expect(page.locator('main#main'), 'Expected main content landmark').toBeVisible();
        await expect(
          page.locator('main#main').locator('h1, h2').first(),
          `Expected a main heading (h1/h2) on ${target.label} page`
        ).toBeVisible({ timeout: 10_000 });
        await page.goBack({ waitUntil: 'domcontentloaded' });
        await expect(home.header()).toBeVisible();
      });
    }
  });

  test('@smoke Mega menu panels can be opened (POLICYHOLDERS)', async ({ page }) => {
    // This demonstrates interaction with a JS-driven mega menu.
    // We keep it small and resilient: open menu, open one panel, assert links are visible.
    // The "More" menu is responsive (shown on smaller screens). Force a smaller viewport.
    await page.setViewportSize({ width: 1000, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Open the "More" menu using the data-action attribute from the DOM
    const openMenu = page.locator('button[data-action="nav.menu.open"]');
    await expect(openMenu, 'Expected "More" menu button to be visible').toBeVisible();
    await openMenu.click();

    // Toggle POLICYHOLDERS panel
    const policyholdersBtn = page
      .locator('.nav-buttons')
      .getByRole('button', { name: /policyholders/i });
    await policyholdersBtn.click();

    // Assert a couple of known links from the provided DOM exist
    await expect(page.getByRole('link', { name: /How to Pay Your Bill and Report Payroll/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Ready for a Premium Audit\?/i })).toBeVisible();
  });
});
