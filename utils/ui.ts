import { Locator, Page, test, TestInfo } from '@playwright/test';
import path from 'path';

export class Ui {
    private page: Page;
    private testInfo: TestInfo;
    private shotCounter = 0;

    constructor(page: Page, testInfo: TestInfo) {
        this.page = page;
        this.testInfo = testInfo;
    }

    private async shot(label: string) {
        this.shotCounter += 1;
        const safe = label.replace(/[^\w.-]+/g, '_').slice(0, 80);
        const fileName = `${String(this.shotCounter).padStart(3,'0')}_${safe}.png`;
        const filePath = this.testInfo.outputPath(fileName);
        await this.page.screenshot({ path: filePath, fullPage: false });
        await this.testInfo.attach(fileName, { path: filePath, contentType: 'image/png' });
    }

    async click(target: Locator | Page | string, label?: string) {
        return test.step(`Click: ${label ?? ''}`.trim(), async () => {
            const locator = this.asLocator(target);
            await locator.click();
            await this.shot(`click_${label ?? 'target'}`);
        });
    }

    async setText(target: Locator | string, value: string, label?: string) {
        return test.step(`Set text: ${label ?? ''}`.trim(), async () => {
            const locator = this.asLocator(target);
            await locator.fill(value);
            await this.shot(`setText_${label ?? 'field'}`);
        });
    }

    async getText(target: Locator | string, label?: string) {
        return test.step(`Get text: ${label ?? ''}`.trim(), async () => {
            const locator = this.asLocator(target);
            const txt = (await locator.textContent())?.trim() ?? '';
            await this.shot(`getText_${label ?? 'node'}`);
            return txt;
        });
    }

    private asLocator(target: Locator | Page | string): Locator {
        if (typeof target === 'string') return this.page.locator(target);
        // if given Page, screenshot after a navigation or general page state
        if ((target as any).locator && !(target as any).click) {
            return target as Locator;
        }
        // You can extend this if you want to accept ElementHandle, etc.
        return target as unknown as Locator;
    }
}
