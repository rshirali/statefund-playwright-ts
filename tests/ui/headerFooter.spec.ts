// tests/headerFooter.spec.ts

import { test } from '@playwright/test';
import { StateFundHomePage } from '../../src/pages/StateFundHomePage';

test.describe('State Fund (CA) - Core Header/Footer Smoke', () => {

    test('@smoke Verify header and footer are visible', async ({ page }, testInfo) => {
        const home = new StateFundHomePage(page, testInfo);

        await home.open('/');
        await home.expectHeaderAndFooterVisible();
        await home.expectCoreHeaderElements();
        await home.ensureFooterInView();
        await home.expectCoreFooterSections();
        await home.attachScreenshot('header_footer', true);
    });
});
