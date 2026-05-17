# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Page Studio Editor >> should change button variant
- Location: tests/e2e/editor.spec.ts:103:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('text=Click me').first()

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
              - generic [ref=e56]: Text
          - generic "Content card with image" [ref=e57]:
            - generic [ref=e58]:
              - img [ref=e60]
              - generic [ref=e62]: Card
          - generic "Large banner section" [ref=e63]:
            - generic [ref=e64]:
              - img [ref=e66]
              - generic [ref=e70]: Hero
          - generic "Container section" [ref=e71]:
            - generic [ref=e72]:
              - img [ref=e74]
              - generic [ref=e78]: Section
          - generic "Responsive grid layout" [ref=e79]:
            - generic [ref=e80]:
              - img [ref=e82]
              - generic [ref=e88]: Grid
          - generic "Simple wrapper" [ref=e89]:
            - generic [ref=e90]:
              - img [ref=e92]
              - generic [ref=e98]: Container
        - paragraph [ref=e100]: Drag or click to add
      - generic [ref=e101]:
        - generic:
          - paragraph: Drag components to canvas to get started
          - paragraph: Position and resize components freely
      - paragraph [ref=e104]: Select a component to edit
    - generic [ref=e106]:
      - generic [ref=e107]: "Editing: Demo Page"
      - generic [ref=e108]: 0 components on page
  - button "Open Next.js Dev Tools" [ref=e114] [cursor=pointer]:
    - img [ref=e115]
  - alert [ref=e119]
```

# Test source

```ts
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
  47  |     await expect(page.locator('text=Click me')).toBeVisible();
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
> 109 |     await page.locator('text=Click me').first().click();
      |                                                 ^ Error: locator.click: Target page, context or browser has been closed
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
  148 |     await buttonPaletteItem.click();
  149 | 
  150 |     await expect(page.locator('text=Click me')).toBeVisible();
  151 | 
  152 |     // Click undo
  153 |     const undoButton = page.locator('button[aria-label="Undo"]');
  154 |     await undoButton.click();
  155 | 
  156 |     // Verify button is removed
  157 |     await expect(page.locator('text=Click me')).not.toBeVisible();
  158 |   });
  159 | 
  160 |   test('should redo component addition', async () => {
  161 |     // Add button
  162 |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  163 |     await buttonPaletteItem.click();
  164 | 
  165 |     // Undo
  166 |     await page.locator('button[aria-label="Undo"]').click();
  167 | 
  168 |     // Redo
  169 |     const redoButton = page.locator('button[aria-label="Redo"]');
  170 |     await expect(redoButton).not.toHaveAttribute('disabled', '');
  171 | 
  172 |     await redoButton.click();
  173 | 
  174 |     // Verify button is back
  175 |     await expect(page.locator('text=Click me')).toBeVisible();
  176 |   });
  177 | 
  178 |   test('should mark changes as unsaved', async () => {
  179 |     // Initially no unsaved changes indicator
  180 |     await expect(page.locator('text=Unsaved changes')).not.toBeVisible();
  181 | 
  182 |     // Add component
  183 |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  184 |     await buttonPaletteItem.click();
  185 | 
  186 |     // Verify unsaved changes indicator
  187 |     await expect(page.locator('text=Unsaved changes')).toBeVisible();
  188 |   });
  189 | 
  190 |   test('should enable save button only with unsaved changes', async () => {
  191 |     const saveButton = page.locator('button:has-text("Save")');
  192 | 
  193 |     // Initially disabled
  194 |     await expect(saveButton).toBeDisabled();
  195 | 
  196 |     // Add component
  197 |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  198 |     await buttonPaletteItem.click();
  199 | 
  200 |     // Now enabled
  201 |     await expect(saveButton).toBeEnabled();
  202 |   });
  203 | 
  204 |   test('should add text component and edit content', async () => {
  205 |     // Add text
  206 |     const textPaletteItem = page.locator('[title="Text content and headings"]').first();
  207 |     await textPaletteItem.click();
  208 | 
  209 |     // Select text
```