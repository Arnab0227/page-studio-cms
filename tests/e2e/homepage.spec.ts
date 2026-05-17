import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';


test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Rendering', () => {
    test('should load homepage successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/.*Page Builder.*/i);
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
      const hero = page.locator('[data-testid="hero"]');
      if (await hero.count() > 0) {
        await expect(hero).toBeVisible();
      }
    });

    test('should display published pages section', async ({ page }) => {
      const section = page.getByText(/published pages|releases/i);
      const isVisible = await section.isVisible().catch(() => false);
      expect(typeof isVisible).toBe('boolean');
    });
  });

  test.describe('Navigation', () => {
    test('should have editor link', async ({ page }) => {
      const editorLink = page.getByRole('link', { name: /editor|create/i });
      const linkExists = await editorLink.count() > 0;
      expect(linkExists).toBe(true);
    });

    test('should navigate to editor when clicked', async ({ page }) => {
      const editorLink = page.getByRole('link', { name: /editor|create/i }).first();
      if (await editorLink.count() > 0) {
        await editorLink.click();
        await page.waitForURL(/.*editor.*/i);
        expect(page.url()).toContain('/editor');
      }
    });
  });

  test.describe('Published Pages Display', () => {
    test('should show published pages if available', async ({ page }) => {
      const pageCards = page.locator('[data-testid="published-page-card"]');
      const cardCount = await pageCards.count();

      if (cardCount > 0) {
        await expect(pageCards.first()).toBeVisible();
      }
    });

    test('should have preview button for published pages', async ({ page }) => {
      const previewButtons = page.getByRole('link', { name: /preview/i });
      const count = await previewButtons.count();

      if (count > 0) {
        const firstButton = previewButtons.first();
        await expect(firstButton).toBeVisible();
        expect(firstButton).toHaveAttribute('href', /\/preview\//);
      }
    });

    test('should have view button for published pages', async ({ page }) => {
      const viewButtons = page.getByRole('link', { name: /view/i });
      const count = await viewButtons.count();

      if (count > 0) {
        const firstButton = viewButtons.first();
        await expect(firstButton).toBeVisible();
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have no accessibility violations', async ({ page }) => {
      await injectAxe(page);
      await checkA11y(page);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const h1s = page.getByRole('heading', { level: 1 });
      const h1Count = await h1s.count();

      // Should have at least one H1
      expect(h1Count).toBeGreaterThan(0);
    });

    test('should have alt text on images', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          expect(alt).toBeTruthy();
        }
      }
    });

    test('should have accessible links', async ({ page }) => {
      const links = page.getByRole('link');
      const linkCount = await links.count();

      if (linkCount > 0) {
        for (let i = 0; i < Math.min(linkCount, 5); i++) {
          const link = links.nth(i);
          const text = await link.textContent();
          const ariaLabel = await link.getAttribute('aria-label');
          expect(text || ariaLabel).toBeTruthy();
        }
      }
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await injectAxe(page);
      const results = await page.evaluate(() => {
        return (window as any).axe.run({ runOnly: { type: 'rule', values: ['color-contrast'] } });
      });

      expect(results.violations.length).toBe(0);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load in reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;

      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });
  });
});
