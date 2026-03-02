import { test, expect, APIRequestContext } from '@playwright/test';

// Follow redirects and return the final response
async function getFinalResponse(request: APIRequestContext, url: string) {
  return request.get(url, { maxRedirects: 10, timeout: 30_000 });
}

test.describe('State Fund (CA) – API health baseline', () => {
  test('@api Home page returns 200 and basic security headers', async ({ request, baseURL }) => {
    const url = new URL('/', baseURL!).toString();
    const res = await request.get(url, { timeout: 30_000 });
    expect(res.status(), 'Home page should return 200/OK').toBe(200);

    const headers = res.headers();
    // Light-weight baseline (header presence varies by platform/CDN; keep expectations modest)
    expect(headers['strict-transport-security'] ?? '', 'HSTS header should be present').not.toEqual('');
  });

  test('@api Key informational pages respond without 4xx/5xx', async ({ request, baseURL }) => {
    // Keep this list short and stable; tune it to the pages you care about in the interview.
    const paths = [
      '/',
      // Add/adjust based on the site's primary nav once you confirm URLs
      '/about-us/',
      '/contact-us/',
    ];

    for (const path of paths) {
      const url = new URL(path, baseURL).toString();
      const res = await getFinalResponse(request, url);
      expect(res.status(), `${url} should not be 4xx/5xx`).toBeLessThan(400);
    }
  });
});
