# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Page Studio Editor >> should load editor interface
- Location: tests/e2e/editor.spec.ts:8:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Editor/
Received string:  "Page Studio - Visual Page Builder"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × unexpected value "Page Studio - Visual Page Builder"

```

```yaml
- link:
  - /url: /
  - button "Back to home"
- heading "Demo Page" [level=1]
- text: Draft
- paragraph: Demo User
- button "publisher"
- button "Undo" [disabled]
- button "Redo" [disabled]
- button "Preview"
- button "Save" [disabled]
- button "Publish"
- heading "Components" [level=2]
- text: Button Text Card Hero Section Grid Container
- paragraph: Drag or click to add
- paragraph: Drag components to canvas to get started
- paragraph: Position and resize components freely
- paragraph: Select a component to edit
- text: "Editing: Demo Page 0 components on page"
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Page Studio Editor', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/editor');
  6   |   });
  7   | 
  8   |   test('should load editor interface', async ({ page }) => {
> 9   |     await expect(page).toHaveTitle(/Editor/);
      |                        ^ Error: expect(page).toHaveTitle(expected) failed
  10  |     await expect(page.getByRole('heading', { name: /editor/i })).toBeVisible();
  11  |   });
  12  | 
  13  |   test('should add button component to canvas', async ({ page }) => {
  14  |     // Click on button component in palette
  15  |     await page.getByRole('button', { name: /button/i }).first().click();
  16  |     
  17  |     // Component should be added to canvas
  18  |     const canvas = page.locator('[data-testid="canvas"]');
  19  |     await expect(canvas).toContainText('Button');
  20  |   });
  21  | 
  22  |   test('should add multiple components', async ({ page }) => {
  23  |     // Add button
  24  |     await page.getByRole('button', { name: /button/i }).first().click();
  25  |     
  26  |     // Add text
  27  |     await page.getByRole('button', { name: /text/i }).first().click();
  28  |     
  29  |     // Add card
  30  |     await page.getByRole('button', { name: /card/i }).first().click();
  31  |     
  32  |     const canvas = page.locator('[data-testid="canvas"]');
  33  |     await expect(canvas).toContainText('Button');
  34  |     await expect(canvas).toContainText('Text');
  35  |     await expect(canvas).toContainText('Card');
  36  |   });
  37  | 
  38  |   test('should drag component from palette to canvas', async ({ page }) => {
  39  |     const paletteButton = page.getByRole('button', { name: /button/i }).first();
  40  |     const canvas = page.locator('[data-testid="canvas"]');
  41  |     
  42  |     // Drag button from palette to canvas
  43  |     await paletteButton.dragTo(canvas);
  44  |     
  45  |     // Button should appear on canvas
  46  |     await expect(canvas).toContainText('Button');
  47  |   });
  48  | 
  49  |   test('should select component for editing', async ({ page }) => {
  50  |     // Add a button
  51  |     await page.getByRole('button', { name: /button/i }).first().click();
  52  |     
  53  |     // Click on the button in the canvas to select it
  54  |     const canvasButton = page.locator('[data-testid="canvas-item"]').first();
  55  |     await canvasButton.click();
  56  |     
  57  |     // Properties panel should show
  58  |     await expect(page.locator('[data-testid="properties-panel"]')).toBeVisible();
  59  |   });
  60  | 
  61  |   test('should edit button properties', async ({ page }) => {
  62  |     // Add a button
  63  |     await page.getByRole('button', { name: /button/i }).first().click();
  64  |     
  65  |     // Click to select
  66  |     const canvasItem = page.locator('[data-testid="canvas-item"]').first();
  67  |     await canvasItem.click();
  68  |     
  69  |     // Edit label property
  70  |     const labelInput = page.locator('[data-testid="prop-label"]');
  71  |     await labelInput.fill('Click Me');
  72  |     
  73  |     // Property should be updated
  74  |     await expect(labelInput).toHaveValue('Click Me');
  75  |   });
  76  | 
  77  |   test('should change button variant', async ({ page }) => {
  78  |     // Add a button
  79  |     await page.getByRole('button', { name: /button/i }).first().click();
  80  |     
  81  |     // Select it
  82  |     await page.locator('[data-testid="canvas-item"]').first().click();
  83  |     
  84  |     // Change variant
  85  |     const variantSelect = page.locator('[data-testid="prop-variant"]');
  86  |     await variantSelect.selectOption('outline');
  87  |     
  88  |     await expect(variantSelect).toHaveValue('outline');
  89  |   });
  90  | 
  91  |   test('should delete component', async ({ page }) => {
  92  |     // Add a button
  93  |     await page.getByRole('button', { name: /button/i }).first().click();
  94  |     
  95  |     // Select it
  96  |     await page.locator('[data-testid="canvas-item"]').first().click();
  97  |     
  98  |     // Press delete
  99  |     await page.keyboard.press('Delete');
  100 |     
  101 |     // Component should be removed
  102 |     const canvas = page.locator('[data-testid="canvas"]');
  103 |     await expect(canvas).not.toContainText('Button');
  104 |   });
  105 | 
  106 |   test('should undo component addition', async ({ page }) => {
  107 |     // Add a button
  108 |     await page.getByRole('button', { name: /button/i }).first().click();
  109 |     
```