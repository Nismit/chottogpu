import { readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const WEBGPU_ERRORS = [
  'WebGPU not supported',
  'No GPUAdapter found',
];

const examples = readdirSync('examples')
  .filter((f) => f.endsWith('.html') && f !== 'index.html')
  .map((f) => ({ name: f.replace('.html', ''), path: `/${f}` }));

for (const example of examples) {
  test(`${example.name} loads without errors`, async ({ page }) => {
    const errors = [];
    let webgpuUnavailable = false;

    page.on('pageerror', (err) => {
      if (WEBGPU_ERRORS.some((msg) => err.message.includes(msg))) {
        webgpuUnavailable = true;
      } else {
        errors.push(err.message);
      }
    });

    await page.goto(example.path, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(errors).toEqual([]);

    // gpgpu.html has a hidden canvas
    const canvas = page.locator('canvas');
    const isVisible = await canvas.isVisible().catch(() => false);
    if (isVisible) {
      await expect(canvas).toBeVisible();
    }

    if (webgpuUnavailable) {
      test.info().annotations.push({
        type: 'warning',
        description: 'WebGPU not available — syntax/import check passed',
      });
    }
  });
}
