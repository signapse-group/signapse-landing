import { expect, test as base } from '@playwright/test';

type RuntimeEvidence = {
  pageErrors: string[];
  consoleErrors: string[];
  failedResponses: Array<{ url: string; status: number }>;
  failedRequests: Array<{ url: string; error: string | undefined }>;
};

function isContactRequest(url: string) {
  try {
    return new URL(url).pathname === '/contact-requests';
  } catch {
    return false;
  }
}

// No backend, login cookie, or application fixture server is needed by the
// standalone public landing. This fixture checks each real browser journey.
export const test = base.extend<{ runtimeEvidence: RuntimeEvidence }>({
  runtimeEvidence: [
    async ({ page }, use, testInfo) => {
      const evidence: RuntimeEvidence = {
        pageErrors: [],
        consoleErrors: [],
        failedResponses: [],
        failedRequests: [],
      };
      page.on('pageerror', (error) => evidence.pageErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        // HTTP and request failures are checked separately; Chromium also
        // reports those same resource failures to the console.
        if (message.text().startsWith('Failed to load resource:')) return;
        evidence.consoleErrors.push(message.text());
      });
      page.on('response', (response) => {
        if (response.status() >= 400 && !isContactRequest(response.url())) {
          evidence.failedResponses.push({
            url: response.url(),
            status: response.status(),
          });
        }
      });
      page.on('requestfailed', (request) => {
        const error = request.failure()?.errorText;
        // Navigation may cancel the outgoing document's requests. This does
        // not hide actual asset/font download errors.
        if (error?.includes('ERR_ABORTED') || isContactRequest(request.url()))
          return;
        evidence.failedRequests.push({ url: request.url(), error });
      });
      await use(evidence);
      await testInfo.attach('runtime-evidence.json', {
        body: JSON.stringify(evidence, null, 2),
        contentType: 'application/json',
      });
      expect(evidence.pageErrors, 'Unhandled browser errors').toEqual([]);
      expect(evidence.consoleErrors, 'Browser console errors').toEqual([]);
      expect(
        evidence.failedResponses,
        'HTTP failures, including assets/fonts',
      ).toEqual([]);
      expect(evidence.failedRequests, 'Failed browser requests').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
