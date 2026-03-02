import { Page } from '@playwright/test';

export type NetworkFailure = {
  url: string;
  method: string;
  resourceType: string;
  failureText?: string;
};

/**
 * Collect request failures + 4xx/5xx responses during navigation.
 * This is a clean Playwright demo differentiator vs Selenium.
 */
export function startNetworkMonitor(page: Page) {
  const requestFailures: NetworkFailure[] = [];
  const badResponses: { url: string; status: number; resourceType: string }[] = [];

  const onRequestFailed = (req: any) => {
    requestFailures.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      failureText: req.failure()?.errorText,
    });
  };

  const onResponse = (res: any) => {
    const status = res.status();
    if (status >= 400) {
      const req = res.request();
      badResponses.push({
        url: res.url(),
        status,
        resourceType: req.resourceType(),
      });
    }
  };

  page.on('requestfailed', onRequestFailed);
  page.on('response', onResponse);

  return {
    stop: () => {
      page.off('requestfailed', onRequestFailed);
      page.off('response', onResponse);
    },
    getFailures: () => ({ requestFailures, badResponses }),
  };
}
