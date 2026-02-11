import {test, expect} from '@playwright/test';

test.describe('Visual regression', () => {
  test('landing page', async ({page}) => {
    await page.goto('/en');
    await page.addStyleTag({content: '* { transition: none !important; animation: none !important; }'});
    await expect(page).toHaveScreenshot('landing-page.png', {fullPage: true});
  });

  test('public preview page', async ({page}) => {
    await page.goto('/en/preview');
    await page.addStyleTag({content: '* { transition: none !important; animation: none !important; }'});
    await expect(page).toHaveScreenshot('preview-page.png', {fullPage: true});
  });

  test('manager page', async ({page}) => {
    await page.goto('/en/manager/orders');
    await page.addStyleTag({content: '* { transition: none !important; animation: none !important; }'});
    await expect(page).toHaveScreenshot('manager-page.png', {fullPage: true});
  });
});
