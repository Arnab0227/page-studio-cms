import { test, expect } from '@playwright/test';

test.describe('Page Studio Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
  });

  test('should load editor interface', async ({ page }) => {
    await expect(page).toHaveTitle(/Editor/);
    await expect(page.getByRole('heading', { name: /editor/i })).toBeVisible();
  });

  test('should add button component to canvas', async ({ page }) => {
    await page.getByRole('button', { name: /button/i }).first().click();
    
    const canvas = page.locator('[data-testid="canvas"]');
    await expect(canvas).toContainText('Button');
  });

  test('should add multiple components', async ({ page }) => {
    await page.getByRole('button', { name: /button/i }).first().click();
    
    await page.getByRole('button', { name: /text/i }).first().click();
    
    await page.getByRole('button', { name: /card/i }).first().click();
    
    const canvas = page.locator('[data-testid="canvas"]');
    await expect(canvas).toContainText('Button');
    await expect(canvas).toContainText('Text');
    await expect(canvas).toContainText('Card');
  });

  test('should drag component from palette to canvas', async ({ page }) => {
    const paletteButton = page.getByRole('button', { name: /button/i }).first();
    const canvas = page.locator('[data-testid="canvas"]');
    
    await paletteButton.dragTo(canvas);
    
    await expect(canvas).toContainText('Button');
  });

  test('should select component for editing', async ({ page }) => {
    await page.getByRole('button', { name: /button/i }).first().click();
    
    const canvasButton = page.locator('[data-testid="canvas-item"]').first();
    await canvasButton.click();
    
    await expect(page.locator('[data-testid="properties-panel"]')).toBeVisible();
  });

  test('should edit button properties', async ({ page }) => {
    await page.getByRole('button', { name: /button/i }).first().click();
    
    const canvasItem = page.locator('[data-testid="canvas-item"]').first();
    await canvasItem.click();
    
    const labelInput = page.locator('[data-testid="prop-label"]');
    await labelInput.fill('Click Me');
    
    await expect(labelInput).toHaveValue('Click Me');
  });

  test('should change button variant', async ({ page }) => {
    await page.getByRole('button', { name: /button/i }).first().click();
    
    await page.locator('[data-testid="canvas-item"]').first().click();
    
    const variantSelect = page.locator('[data-testid="prop-variant"]');
    await variantSelect.selectOption('outline');
    
    await expect(variantSelect).toHaveValue('outline');
  });

  test('should delete component', async ({ page }) => {
    await page.getByRole('button', { name: /button/i }).first().click();
    
    await page.locator('[data-testid="canvas-item"]').first().click();
    
    await page.keyboard.press('Delete');
    
    const canvas = page.locator('[data-testid="canvas"]');
    await expect(canvas).not.toContainText('Button');
  });

  test('should undo component addition', async ({ page }) => {
    await page.getByRole('button', { name: /button/i }).first().click();
    
    await page.keyboard.press('Control+Z');
    
    const canvas = page.locator('[data-testid="canvas"]');
    await expect(canvas).not.toContainText('Button');
  });

  test('should redo component addition', async ({ page }) => {
    await page.getByRole('button', { name: /button/i }).first().click();
    await page.keyboard.press('Control+Z');
    await page.keyboard.press('Control+Shift+Z');
    
    const canvas = page.locator('[data-testid="canvas"]');
    await expect(canvas).toContainText('Button');
  });

  test('should mark changes as unsaved', async ({ page }) => {
    let saveButton = page.getByRole('button', { name: /save/i });
    await expect(saveButton).toBeDisabled();
    
    await page.getByRole('button', { name: /button/i }).first().click();
    
    saveButton = page.getByRole('button', { name: /save/i });
    await expect(saveButton).toBeEnabled();
  });

  test('should enable save button only with unsaved changes', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /save/i });
    
    await expect(saveButton).toBeDisabled();
    
    await page.getByRole('button', { name: /button/i }).first().click();
    await expect(saveButton).toBeEnabled();
    
    await saveButton.click();
    
    await expect(saveButton).toBeDisabled();
  });

  test('should add text component and edit content', async ({ page }) => {
    await page.getByRole('button', { name: /text/i }).first().click();
    
    await page.locator('[data-testid="canvas-item"]').first().click();
    
    const contentInput = page.locator('[data-testid="prop-content"]');
    await contentInput.fill('Hello World');
    
    await expect(contentInput).toHaveValue('Hello World');
  });

  test('should add card component', async ({ page }) => {
    await page.getByRole('button', { name: /card/i }).first().click();
    
    const canvas = page.locator('[data-testid="canvas"]');
    await expect(canvas).toContainText('Card');
  });

  test('should add hero component', async ({ page }) => {
    await page.getByRole('button', { name: /hero/i }).first().click();
    
    const canvas = page.locator('[data-testid="canvas"]');
    await expect(canvas).toContainText('Hero');
  });

  test('should show/hide empty canvas message', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]');
    
    await expect(canvas.getByText(/drag components/i)).toBeVisible();
    
    await page.getByRole('button', { name: /button/i }).first().click();
    
    await expect(canvas.getByText(/drag components/i)).not.toBeVisible();
  });

  test('should display component count in status bar', async ({ page }) => {
    await page.getByRole('button', { name: /button/i }).first().click();
    await page.getByRole('button', { name: /text/i }).first().click();
    await page.getByRole('button', { name: /card/i }).first().click();
    
    const statusBar = page.locator('[data-testid="status-bar"]');
    await expect(statusBar).toContainText('3');
  });
});
