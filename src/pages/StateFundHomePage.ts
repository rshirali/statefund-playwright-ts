// src/pages/StateFundHomePage.ts
// A lightweight, resilient Page Object for State Fund's public site.
// It intentionally avoids brittle CSS/XPath selectors and prefers semantics.

import { expect, Locator, Page, TestInfo } from '@playwright/test';

export class StateFundHomePage {
  constructor(
    private readonly page: Page,
    private readonly testInfo?: TestInfo
  ) {}

  // --- Core landmark locators (robust across redesigns) ---
  header(): Locator {
    // Site currently uses <header class="new-nav">.
    // Explicit header element, fall back to banner landmark.
    return this.page
      .locator('header.new-nav')
      .first()
      .or(this.page.locator('header').first())
      .or(this.page.getByRole('banner').first());
  }

  navigation(): Locator {
    return this.page.getByRole('navigation').first();
  }

  footer(): Locator {
    // Prefer <footer>, fall back to contentinfo landmark.
    return this.page
      .locator('footer.footer')
      .first()
      .or(this.page.locator('footer').first())
      .or(this.page.getByRole('contentinfo').first());
  }

  // --- Accessibility landmarks, stable locators based on current DOM ---
  skipToContentLink(): Locator {
    return this.page.getByRole('link', { name: /skip to content/i });
  }

  logoLink(): Locator {
    return this.header().locator('a.nav-logo-link:visible');
  }

  topNavLink(name: string): Locator {
    // Desktop nav links: <a class="nav-link">For Brokers</a>
    return this.header().locator('a.nav-link', { hasText: name });
  }

  loginLink(): Locator {
    return this.header().locator('.nav-main-bar a.nav-login');
  }

  footerSection(title: string): Locator {
    return this.footer().locator('h2.footer-nav-grp-title', { hasText: title });
  }

  async open(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    // Page should not be a blank shell.
    await expect(this.page.locator('body'), 'Body should render').toBeVisible();
  }

  async expectHeaderAndFooterVisible() {
    await expect(this.header(), 'Header should be visible').toBeVisible();
    await expect(this.footer(), 'Footer should be visible').toBeVisible();
  }

  async expectCoreHeaderElements() {
    await expect(this.skipToContentLink(), 'Skip link should be present for accessibility').toBeVisible();
    await expect(this.logoLink(), 'Logo link should be visible').toBeVisible();
    await expect(this.loginLink(), 'Login / Create Account link should exist').toBeVisible();
  }

  async expectCoreFooterSections() {
    //  Section headings exist in the provided DOM.
    for (const title of ["I'm a", 'Services', 'Information', 'Contact', 'Legal']) {
      await expect(this.footerSection(title), `Footer section should exist: ${title}`).toBeVisible();
    }
  }

  async ensureFooterInView() {
    await this.footer().scrollIntoViewIfNeeded();
    await expect(this.footer()).toBeVisible();
  }

  async attachScreenshot(label: string, fullPage = false) {
    if (!this.testInfo) return;
    const safe = label.replace(/[^\w.-]+/g, '_').slice(0, 80);
    const fileName = `${safe}.png`;
    const filePath = this.testInfo.outputPath(fileName);
    await this.page.screenshot({ path: filePath, fullPage });
    await this.testInfo.attach(fileName, { path: filePath, contentType: 'image/png' });
  }
}
