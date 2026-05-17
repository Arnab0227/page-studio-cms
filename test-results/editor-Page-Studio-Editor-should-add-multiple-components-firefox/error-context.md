# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Page Studio Editor >> should add multiple components
- Location: tests/e2e/editor.spec.ts:37:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Click me')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Click me')

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
  1   | /**
  2   |  * End-to-end tests for the Page Studio editor
  3   |  * Tests complete user workflows and integrations
  4   |  */
  5   | 
  6   | import { test, expect, Page } from '@playwright/test';
  7   | 
  8   | test.describe('Page Studio Editor', () => {
  9   |   let page: Page;
  10  | 
  11  |   test.beforeEach(async ({ browser }) => {
  12  |     page = await browser.newPage();
  13  |     await page.goto('/editor');
  14  |     // Wait for editor to load
  15  |     await page.waitForLoadState('networkidle');
  16  |   });
  17  | 
  18  |   test.afterEach(async () => {
  19  |     await page.close();
  20  |   });
  21  | 
  22  |   test('should load editor interface', async () => {
  23  |     // Check for main editor components
  24  |     await expect(page.locator('text=Components')).toBeVisible();
  25  |     await expect(page.locator('text=Unsaved changes')).toBeHidden();
  26  |   });
  27  | 
  28  |   test('should add button component to canvas', async () => {
  29  |     // Find and click button in palette
  30  |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  31  |     await buttonPaletteItem.click();
  32  | 
  33  |     // Verify button was added to canvas
  34  |     await expect(page.locator('text=Click me')).toBeVisible();
  35  |   });
  36  | 
  37  |   test('should add multiple components', async () => {
  38  |     // Add button
  39  |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  40  |     await buttonPaletteItem.click();
  41  | 
  42  |     // Add text
  43  |     const textPaletteItem = page.locator('[title="Text content and headings"]').first();
  44  |     await textPaletteItem.click();
  45  | 
  46  |     // Verify both components are on canvas
> 47  |     await expect(page.locator('text=Click me')).toBeVisible();
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  48  |     await expect(page.locator('text=Add your text here')).toBeVisible();
  49  |   });
  50  | 
  51  |   test('should drag component from palette to canvas', async () => {
  52  |     // Get palette item
  53  |     const cardItem = page.locator('[title="Content card with image"]').first();
  54  | 
  55  |     // Get canvas drop zone
  56  |     const canvas = page.locator('text=Drag components here to get started').first();
  57  | 
  58  |     // Drag and drop
  59  |     await cardItem.dragTo(canvas);
  60  | 
  61  |     // Wait a moment for the component to be added
  62  |     await page.waitForTimeout(500);
  63  | 
  64  |     // Verify card was added
  65  |     await expect(page.locator('text=Card Title')).toBeVisible();
  66  |   });
  67  | 
  68  |   test('should select component for editing', async () => {
  69  |     // Add a button
  70  |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  71  |     await buttonPaletteItem.click();
  72  | 
  73  |     // Click on the button in the canvas to select it
  74  |     const buttonInCanvas = page.locator('text=Click me').first();
  75  |     await buttonInCanvas.click();
  76  | 
  77  |     // Verify properties panel shows button properties
  78  |     await expect(page.locator('text=Button Properties')).toBeVisible();
  79  |     await expect(page.locator('input[placeholder="Button text"]')).toBeVisible();
  80  |   });
  81  | 
  82  |   test('should edit button properties', async () => {
  83  |     // Add button
  84  |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  85  |     await buttonPaletteItem.click();
  86  | 
  87  |     // Select button
  88  |     const buttonInCanvas = page.locator('text=Click me').first();
  89  |     await buttonInCanvas.click();
  90  | 
  91  |     // Edit label
  92  |     const labelInput = page.locator('input[placeholder="Button text"]');
  93  |     await labelInput.clear();
  94  |     await labelInput.fill('My Custom Button');
  95  | 
  96  |     // Click update button
  97  |     await page.locator('button:has-text("Update Properties")').click();
  98  | 
  99  |     // Verify change
  100 |     await expect(page.locator('text=My Custom Button')).toBeVisible();
  101 |   });
  102 | 
  103 |   test('should change button variant', async () => {
  104 |     // Add button
  105 |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  106 |     await buttonPaletteItem.click();
  107 | 
  108 |     // Select button
  109 |     await page.locator('text=Click me').first().click();
  110 | 
  111 |     // Change variant
  112 |     const variantSelect = page.locator('#variant').first();
  113 |     await variantSelect.click();
  114 |     await page.locator('text=Outline').first().click();
  115 | 
  116 |     // Update
  117 |     await page.locator('button:has-text("Update Properties")').click();
  118 | 
  119 |     // Verify class changed
  120 |     const buttonElement = page.locator('[class*="border-2"]').first();
  121 |     await expect(buttonElement).toBeVisible();
  122 |   });
  123 | 
  124 |   test('should delete component', async () => {
  125 |     // Add button
  126 |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  127 |     await buttonPaletteItem.click();
  128 | 
  129 |     await expect(page.locator('text=Click me')).toBeVisible();
  130 | 
  131 |     // Select button
  132 |     await page.locator('text=Click me').first().click();
  133 | 
  134 |     // Click delete button (trash icon in properties panel)
  135 |     const deleteButton = page.locator('button[title="Delete component"]');
  136 |     await deleteButton.click();
  137 | 
  138 |     // Accept confirmation
  139 |     await page.on('dialog', dialog => dialog.accept());
  140 | 
  141 |     // Verify button is removed
  142 |     await expect(page.locator('text=Click me')).not.toBeVisible();
  143 |   });
  144 | 
  145 |   test('should undo component addition', async () => {
  146 |     // Add button
  147 |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
```