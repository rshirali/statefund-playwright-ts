import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { StateFundHomePage } from '../../src/pages/StateFundHomePage';
import { setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(60_000);

Given('I am on the State Fund home page', async function (this: CustomWorld) {
  const home = new StateFundHomePage(this.page);
  await home.open('/');
  await expect(home.header()).toBeVisible({ timeout: 30_000 });
});

When('I click the top navigation link {string}', async function (this: CustomWorld, linkName: string) {
  const home = new StateFundHomePage(this.page);
  await home.topNavLink(linkName).first().click();
});

Then('the URL should match {string}', async function (this: CustomWorld, path: string) {
  await expect(this.page).toHaveURL(new RegExp(`${path.replace(/\//g, '\\/')}/?$`));
});

Then('I should see main content with a visible heading', async function (this: CustomWorld) {
  await expect(this.page.locator('main#main')).toBeVisible();
  await expect(
    this.page.locator('main#main').locator('h1, h2').first()
  ).toBeVisible();
});
