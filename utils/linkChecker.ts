import { APIRequestContext, expect, Page, test } from '@playwright/test';

export type LinkCheckResult = {
  href: string;
  absoluteUrl: string;
  status: number;
  contentType?: string;
  ok: boolean;
  note?: string;
};

export type LinkCheckOptions = {
  maxRedirects?: number;
  soft?: boolean;
  onlySameOrigin?: boolean;
  ignoreDomains?: string[];
  softExternal?: boolean;
};

const SKIP_PREFIXES = ['mailto:', 'tel:', 'javascript:'];

function isSkippable(href: string): boolean {
  const h = href.trim();
  if (!h) return true;
  if (h === '#') return true;
  return SKIP_PREFIXES.some(p => h.toLowerCase().startsWith(p));
}

function toAbsolute(baseUrl: string, href: string): string {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

export async function collectHrefs(page: Page, containerSelector: string): Promise<string[]> {
  const locator = page.locator(containerSelector).first();
  const hrefs = await locator.locator('a[href]').evaluateAll(els => {
    const set = new Set<string>();
    for (const el of els) {
      const href = (el as HTMLAnchorElement).getAttribute('href') || '';
      set.add(href.trim());
    }
    return Array.from(set);
  });
  return hrefs.filter(h => !isSkippable(h));
}

export async function checkLinks(
    request: APIRequestContext,
    baseUrl: string,
    hrefs: string[],
    opts?: LinkCheckOptions
): Promise<LinkCheckResult[]> {
  const maxRedirects = opts?.maxRedirects ?? 10;
  const soft = opts?.soft ?? false;
  const onlySameOrigin = opts?.onlySameOrigin ?? false;
  const ignoreDomains = opts?.ignoreDomains ?? [];
  const softExternal = opts?.softExternal ?? true;

  const baseOrigin = (() => {
    try {
      return new URL(baseUrl).origin;
    } catch {
      return '';
    }
  })();

  const isIgnoredDomain = (u: string) => ignoreDomains.some(d => u.includes(d));

  const results: LinkCheckResult[] = [];

  for (const href of hrefs) {
    const absoluteUrl = toAbsolute(baseUrl, href);
    const label = `link: ${href}`;

    if (isIgnoredDomain(absoluteUrl)) {
      results.push({ href, absoluteUrl, status: 0, ok: true, note: 'skipped (ignored domain)' });
      continue;
    }

    if (onlySameOrigin && baseOrigin) {
      try {
        const origin = new URL(absoluteUrl).origin;
        if (origin !== baseOrigin) {
          const skipped: LinkCheckResult = {
            href,
            absoluteUrl,
            status: 0,
            ok: softExternal,
            note: 'skipped external',
          };
          results.push(skipped);
          if (!soft && !softExternal) {
            expect(false, `External link validation disabled but encountered: ${absoluteUrl}`).toBeTruthy();
          }
          continue;
        }
      } catch {
        // proceed
      }
    }

    const result = await test.step(`HTTP check ${label}`, async () => {
      try {
        const res = await request.get(absoluteUrl, {
          maxRedirects,
          timeout: 30_000,          // 🔥 critical fix for Docker
          failOnStatusCode: false,  // don't throw on 4xx/5xx
        });

        const status = res.status();
        const headers = res.headers();
        const contentType = headers['content-type'];
        const ok = status < 400;

        const looksPdf =
            /\.pdf(\?.*)?$/i.test(absoluteUrl) ||
            (contentType?.includes('pdf') ?? false);

        if (looksPdf && ok) {
          const ct = contentType ?? '';
          if (!ct.toLowerCase().includes('application/pdf')) {
            return { href, absoluteUrl, status, contentType, ok: false, note: 'Expected PDF content-type' };
          }
        }

        return { href, absoluteUrl, status, contentType, ok };
      } catch (e: any) {
        const msg = e?.message ?? e?.toString?.() ?? 'request failed';
        return { href, absoluteUrl, status: 0, ok: false, note: msg };
      }
    });

    results.push(result);

    if (!soft) {
      expect(
          result.ok,
          `Broken link in container: ${result.absoluteUrl} (${result.status})`
      ).toBeTruthy();
    }
  }

  return results;
}