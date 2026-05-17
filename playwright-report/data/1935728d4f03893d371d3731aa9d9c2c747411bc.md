# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Page Studio Editor >> should add card component
- Location: tests/e2e/editor.spec.ts:224:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Card Title')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Card Title')

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
> 230 |     await expect(page.locator('text=Card Title')).toBeVisible();
      |                                                   ^ Error: expect(locator).toBeVisible() failed
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
  251 |   test('should show/hide empty canvas message', async () => {
  252 |     // Initially shows empty message
  253 |     await expect(
  254 |       page.locator('text=Drag components here to get started')
  255 |     ).toBeVisible();
  256 | 
  257 |     // Add component
  258 |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  259 |     await buttonPaletteItem.click();
  260 | 
  261 |     // Empty message should hide
  262 |     await expect(
  263 |       page.locator('text=Drag components here to get started')
  264 |     ).not.toBeVisible();
  265 |   });
  266 | 
  267 |   test('should display component count in status bar', async () => {
  268 |     // Initially 0 components
  269 |     await expect(page.locator('text=0 components on page')).toBeVisible();
  270 | 
  271 |     // Add button
  272 |     const buttonPaletteItem = page.locator('[title="Clickable button element"]').first();
  273 |     await buttonPaletteItem.click();
  274 | 
  275 |     // Count should update
  276 |     await expect(page.locator('text=1 component on page')).toBeVisible();
  277 | 
  278 |     // Add another
  279 |     await buttonPaletteItem.click();
  280 | 
  281 |     // Count should be 2
  282 |     await expect(page.locator('text=2 components on page')).toBeVisible();
  283 |   });
  284 | });
  285 | 
```