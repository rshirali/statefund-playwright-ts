import { Before, After } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { CustomWorld } from './world';

Before(async function (this: CustomWorld) {
  const headless = (process.env.HEADLESS ?? 'false') === 'true';
  this.browser = await chromium.launch({ headless });
  this.context = await this.browser.newContext({
    baseURL: process.env.BASE_URL || 'https://www.statefundca.com',
  });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  await this.page?.close().catch(() => {});
  await this.context?.close().catch(() => {});
  await this.browser?.close().catch(() => {});
});
