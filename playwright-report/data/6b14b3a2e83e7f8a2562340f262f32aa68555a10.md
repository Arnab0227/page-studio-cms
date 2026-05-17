# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Page Studio Editor >> should undo component addition
- Location: tests/e2e/editor.spec.ts:145:7

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
  148 |     await buttonPaletteItem.click();
  149 | 
> 150 |     await expect(page.locator('text=Click me')).toBeVisible();
      |                                                 ^ Error: expect(locator).toBeVisible() failed
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
  210 |     await page.locator('text=Add your text here').click();
  211 | 
  212 |     // Edit content
  213 |     const contentTextarea = page.locator('textarea[placeholder="Text content"]');
  214 |     await contentTextarea.clear();
  215 |     await contentTextarea.fill('This is custom text');
  216 | 
  217 |     // Update
  218 |     await page.locator('button:has-text("Update Properties")').click();
  219 | 
  220 |     // Verify
  221 |     await expect(page.locator('text=This is custom text')).toBeVisible();
  222 |   });
  223 | 
  224 |   test('should add card component', async () => {
  225 |     // Add card
  226 |     const cardPaletteItem = page.locator('[title="Content card with image"]').first();
  227 |     await cardPaletteItem.click();
  228 | 
  229 |     // Verify card was added
  230 |     await expect(page.locator('text=Card Title')).toBeVisible();
  231 |   });
  232 | 
  233 |   test('should add hero component', async () => {
  234 |     // Add hero
  235 |     const heroPaletteItem = page.locator('[title="Large banner section"]').first();
  236 |     await heroPaletteItem.click();
  237 | 
  238 |     // Verify hero was added
  239 |     await expect(page.locator('text=Welcome to our page')).toBeVisible();
  240 |   });
  241 | 
  242 |   test('should add grid component with children', async () => {
  243 |     // Add grid
  244 |     const gridPaletteItem = page.locator('[title="Responsive grid layout"]').first();
  245 |     await gridPaletteItem.click();
  246 | 
  247 |     // Grid should be on canvas
  248 |     await expect(page.locator('text=Grid')).toBeVisible();
  249 |   });
  250 | 
```