# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Page Studio Editor >> should show/hide empty canvas message
- Location: tests/e2e/editor.spec.ts:189:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="canvas"]').getByText(/drag components/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="canvas"]').getByText(/drag components/i)

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
  110 |     // Undo
  111 |     await page.keyboard.press('Control+Z');
  112 |     
  113 |     // Button should be removed
  114 |     const canvas = page.locator('[data-testid="canvas"]');
  115 |     await expect(canvas).not.toContainText('Button');
  116 |   });
  117 | 
  118 |   test('should redo component addition', async ({ page }) => {
  119 |     // Add button, undo, redo
  120 |     await page.getByRole('button', { name: /button/i }).first().click();
  121 |     await page.keyboard.press('Control+Z');
  122 |     await page.keyboard.press('Control+Shift+Z');
  123 |     
  124 |     // Button should be back
  125 |     const canvas = page.locator('[data-testid="canvas"]');
  126 |     await expect(canvas).toContainText('Button');
  127 |   });
  128 | 
  129 |   test('should mark changes as unsaved', async ({ page }) => {
  130 |     // Initially saved
  131 |     let saveButton = page.getByRole('button', { name: /save/i });
  132 |     await expect(saveButton).toBeDisabled();
  133 |     
  134 |     // Add component
  135 |     await page.getByRole('button', { name: /button/i }).first().click();
  136 |     
  137 |     // Save button should be enabled
  138 |     saveButton = page.getByRole('button', { name: /save/i });
  139 |     await expect(saveButton).toBeEnabled();
  140 |   });
  141 | 
  142 |   test('should enable save button only with unsaved changes', async ({ page }) => {
  143 |     const saveButton = page.getByRole('button', { name: /save/i });
  144 |     
  145 |     // Initially disabled
  146 |     await expect(saveButton).toBeDisabled();
  147 |     
  148 |     // Add component - should enable
  149 |     await page.getByRole('button', { name: /button/i }).first().click();
  150 |     await expect(saveButton).toBeEnabled();
  151 |     
  152 |     // Save
  153 |     await saveButton.click();
  154 |     
  155 |     // Should be disabled again
  156 |     await expect(saveButton).toBeDisabled();
  157 |   });
  158 | 
  159 |   test('should add text component and edit content', async ({ page }) => {
  160 |     // Add text
  161 |     await page.getByRole('button', { name: /text/i }).first().click();
  162 |     
  163 |     // Select it
  164 |     await page.locator('[data-testid="canvas-item"]').first().click();
  165 |     
  166 |     // Edit content
  167 |     const contentInput = page.locator('[data-testid="prop-content"]');
  168 |     await contentInput.fill('Hello World');
  169 |     
  170 |     await expect(contentInput).toHaveValue('Hello World');
  171 |   });
  172 | 
  173 |   test('should add card component', async ({ page }) => {
  174 |     // Add card
  175 |     await page.getByRole('button', { name: /card/i }).first().click();
  176 |     
  177 |     const canvas = page.locator('[data-testid="canvas"]');
  178 |     await expect(canvas).toContainText('Card');
  179 |   });
  180 | 
  181 |   test('should add hero component', async ({ page }) => {
  182 |     // Add hero
  183 |     await page.getByRole('button', { name: /hero/i }).first().click();
  184 |     
  185 |     const canvas = page.locator('[data-testid="canvas"]');
  186 |     await expect(canvas).toContainText('Hero');
  187 |   });
  188 | 
  189 |   test('should show/hide empty canvas message', async ({ page }) => {
  190 |     const canvas = page.locator('[data-testid="canvas"]');
  191 |     
  192 |     // Empty canvas should show message
> 193 |     await expect(canvas.getByText(/drag components/i)).toBeVisible();
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  194 |     
  195 |     // Add component
  196 |     await page.getByRole('button', { name: /button/i }).first().click();
  197 |     
  198 |     // Message should hide
  199 |     await expect(canvas.getByText(/drag components/i)).not.toBeVisible();
  200 |   });
  201 | 
  202 |   test('should display component count in status bar', async ({ page }) => {
  203 |     // Add three components
  204 |     await page.getByRole('button', { name: /button/i }).first().click();
  205 |     await page.getByRole('button', { name: /text/i }).first().click();
  206 |     await page.getByRole('button', { name: /card/i }).first().click();
  207 |     
  208 |     // Check status bar
  209 |     const statusBar = page.locator('[data-testid="status-bar"]');
  210 |     await expect(statusBar).toContainText('3');
  211 |   });
  212 | });
  213 | 
```