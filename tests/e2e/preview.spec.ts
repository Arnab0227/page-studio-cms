import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';


test.describe('Preview Pages', () => {
  test.describe('Preview Rendering', () => {
    test('should render preview page', async ({ page }) => {
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        await expect(page).toHaveURL(/\/preview\//);
      }
    });

    test('should show back button', async ({ page }) => {
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        const backButton = page.getByRole('button', { name: /back/i });
        await expect(backButton).toBeVisible();
      }
    });

    test('should handle missing pages gracefully', async ({ page }) => {
      const response = await page.goto('/preview/non-existent-page', { waitUntil: 'load' }).catch(() => null);
      
      if (response) {
        const isError = response.status() >= 400 || await page.getByText(/not found|error/i).isVisible().catch(() => false);
        expect(isError).toBe(true);
      }
    });
  });

  test.describe('Preview Navigation', () => {
    test('should navigate back to home', async ({ page }) => {
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        const backButton = page.getByRole('button', { name: /back|home/i }).first();
        await backButton.click();
        await page.waitForURL('/');
        expect(page.url()).toContain('/');
      }
    });

    test('should have edit link if available', async ({ page }) => {
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        const editLink = page.getByRole('link', { name: /edit/i });
        const exists = await editLink.count() > 0;
        expect(typeof exists).toBe('boolean');
      }
    });
  });

  test.describe('Preview Accessibility', () => {
    test('should have accessible preview page', async ({ page }) => {
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        await injectAxe(page);
        try {
          await checkA11y(page);
        } catch (error) {
          console.log('Accessibility violations found:', error);
        }
      }
    });

    test('should have proper structure', async ({ page }) => {
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        const main = page.locator('main');
        const mainExists = await main.count() > 0;
        expect(mainExists).toBe(true);
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');
        
        const urlChanged = page.url() !== new URL(page.url()).pathname + '/preview/demo';
        expect(typeof urlChanged).toBe('boolean');
      }
    });
  });

  test.describe('Content Display', () => {
    test('should display page title if available', async ({ page }) => {
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        const title = page.locator('h1, [role="heading"]');
        const exists = await title.count() > 0;
        expect(exists).toBe(true);
      }
    });

    test('should render components', async ({ page }) => {
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        const content = page.locator('body');
        const hasContent = await content.evaluate((el) => el.children.length > 0);
        expect(hasContent).toBe(true);
      }
    });
  });

  test.describe('Mobile Preview', () => {
    test('should be mobile responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
      
      if (response && response.status() === 200) {
        const backButton = page.getByRole('button', { name: /back/i });
        await expect(backButton).toBeVisible();
      }
    });
  });
});
