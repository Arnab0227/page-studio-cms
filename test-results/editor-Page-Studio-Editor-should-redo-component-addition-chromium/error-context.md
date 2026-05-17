# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Page Studio Editor >> should redo component addition
- Location: tests/e2e/editor.spec.ts:118:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /button/i }).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link [ref=e7] [cursor=pointer]:
          - /url: /
          - button "Back to home" [ref=e8]:
            - img
        - generic [ref=e9]:
          - heading "Demo Page" [level=1] [ref=e10]
          - generic [ref=e12]: Draft
      - generic [ref=e14]:
        - paragraph [ref=e15]: Demo User
        - button "publisher" [ref=e17]:
          - generic [ref=e18]: publisher
          - img [ref=e19]
    - generic [ref=e21]:
      - generic [ref=e22]:
        - button "Undo" [disabled] [ref=e23]:
          - img [ref=e24]
        - button "Redo" [disabled] [ref=e27]:
          - img [ref=e28]
      - generic [ref=e32]:
        - button "Preview" [ref=e33]:
          - img
          - text: Preview
        - button "Save" [disabled]:
          - img
          - text: Save
        - button "Publish" [ref=e34]
    - generic [ref=e35]:
      - generic [ref=e37]:
        - heading "Components" [level=2] [ref=e39]
        - generic [ref=e41]:
          - generic "Clickable button element" [ref=e42]:
            - generic [ref=e43]:
              - img [ref=e45]
              - generic [ref=e48]: Button
          - generic "Text content and headings" [ref=e49]:
            - generic [ref=e50]:
              - img [ref=e52]
              - generic [ref=e54]: Text
          - generic "Content card with image" [ref=e55]:
            - generic [ref=e56]:
              - img [ref=e58]
              - generic [ref=e60]: Card
          - generic "Large banner section" [ref=e61]:
            - generic [ref=e62]:
              - img [ref=e64]
              - generic [ref=e66]: Hero
          - generic "Container section" [ref=e67]:
            - generic [ref=e68]:
              - img [ref=e70]
              - generic [ref=e72]: Section
          - generic "Responsive grid layout" [ref=e73]:
            - generic [ref=e74]:
              - img [ref=e76]
              - generic [ref=e78]: Grid
          - generic "Simple wrapper" [ref=e79]:
            - generic [ref=e80]:
              - img [ref=e82]
              - generic [ref=e86]: Container
        - paragraph [ref=e88]: Drag or click to add
      - generic [ref=e89]:
        - generic:
          - paragraph: Drag components to canvas to get started
          - paragraph: Position and resize components freely
      - paragraph [ref=e92]: Select a component to edit
    - generic [ref=e94]:
      - generic [ref=e95]: "Editing: Demo Page"
      - generic [ref=e96]: 0 components on page
  - generic [ref=e102] [cursor=pointer]:
    - button "Open issues overlay" [ref=e103]:
      - img [ref=e105]
      - generic [ref=e107]:
        - generic [ref=e108]: "3"
        - generic [ref=e109]: "4"
      - generic [ref=e110]:
        - text: Issue
        - generic [ref=e111]: s
    - button "Collapse issues badge" [ref=e112]:
      - img [ref=e113]
  - alert [ref=e115]
```

# Test source

```ts
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
> 120 |     await page.getByRole('button', { name: /button/i }).first().click();
      |                                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  193 |     await expect(canvas.getByText(/drag components/i)).toBeVisible();
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