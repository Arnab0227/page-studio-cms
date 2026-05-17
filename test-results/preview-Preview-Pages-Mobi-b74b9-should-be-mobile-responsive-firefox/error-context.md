# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: preview.spec.ts >> Preview Pages >> Mobile Preview >> should be mobile responsive
- Location: tests/e2e/preview.spec.ts:129:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /back/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /back/i })

```

```yaml
- link "Back to editor":
  - /url: /editor
- heading "Demo Page" [level=1]
- paragraph: Draft Preview
- text: Draft
- link "Edit":
  - /url: /editor?id=demo-page
  - button "Edit"
- main:
  - paragraph: fdsfs
  - button "dsf"
- contentinfo:
  - paragraph: Draft version - changes are not yet published
- alert
```

# Test source

```ts
  35  |         const isError = response.status() >= 400 || await page.getByText(/not found|error/i).isVisible().catch(() => false);
  36  |         expect(isError).toBe(true);
  37  |       }
  38  |     });
  39  |   });
  40  | 
  41  |   test.describe('Preview Navigation', () => {
  42  |     test('should navigate back to home', async ({ page }) => {
  43  |       const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
  44  |       
  45  |       if (response && response.status() === 200) {
  46  |         const backButton = page.getByRole('button', { name: /back|home/i }).first();
  47  |         await backButton.click();
  48  |         await page.waitForURL('/');
  49  |         expect(page.url()).toContain('/');
  50  |       }
  51  |     });
  52  | 
  53  |     test('should have edit link if available', async ({ page }) => {
  54  |       const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
  55  |       
  56  |       if (response && response.status() === 200) {
  57  |         const editLink = page.getByRole('link', { name: /edit/i });
  58  |         const exists = await editLink.count() > 0;
  59  |         expect(typeof exists).toBe('boolean');
  60  |       }
  61  |     });
  62  |   });
  63  | 
  64  |   test.describe('Preview Accessibility', () => {
  65  |     test('should have accessible preview page', async ({ page }) => {
  66  |       const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
  67  |       
  68  |       if (response && response.status() === 200) {
  69  |         await injectAxe(page);
  70  |         try {
  71  |           await checkA11y(page);
  72  |         } catch (error) {
  73  |           // Some violations might be expected, but we document them
  74  |           console.log('Accessibility violations found:', error);
  75  |         }
  76  |       }
  77  |     });
  78  | 
  79  |     test('should have proper structure', async ({ page }) => {
  80  |       const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
  81  |       
  82  |       if (response && response.status() === 200) {
  83  |         // Should have main content
  84  |         const main = page.locator('main');
  85  |         const mainExists = await main.count() > 0;
  86  |         expect(mainExists).toBe(true);
  87  |       }
  88  |     });
  89  | 
  90  |     test('should be keyboard navigable', async ({ page }) => {
  91  |       const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
  92  |       
  93  |       if (response && response.status() === 200) {
  94  |         // Tab to back button and activate
  95  |         await page.keyboard.press('Tab');
  96  |         await page.keyboard.press('Enter');
  97  |         
  98  |         // Should navigate somewhere
  99  |         const urlChanged = page.url() !== new URL(page.url()).pathname + '/preview/demo';
  100 |         expect(typeof urlChanged).toBe('boolean');
  101 |       }
  102 |     });
  103 |   });
  104 | 
  105 |   test.describe('Content Display', () => {
  106 |     test('should display page title if available', async ({ page }) => {
  107 |       const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
  108 |       
  109 |       if (response && response.status() === 200) {
  110 |         const title = page.locator('h1, [role="heading"]');
  111 |         const exists = await title.count() > 0;
  112 |         expect(exists).toBe(true);
  113 |       }
  114 |     });
  115 | 
  116 |     test('should render components', async ({ page }) => {
  117 |       const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
  118 |       
  119 |       if (response && response.status() === 200) {
  120 |         // Check if any components are rendered
  121 |         const content = page.locator('body');
  122 |         const hasContent = await content.evaluate((el) => el.children.length > 0);
  123 |         expect(hasContent).toBe(true);
  124 |       }
  125 |     });
  126 |   });
  127 | 
  128 |   test.describe('Mobile Preview', () => {
  129 |     test('should be mobile responsive', async ({ page }) => {
  130 |       await page.setViewportSize({ width: 375, height: 667 });
  131 |       const response = await page.goto('/preview/demo', { waitUntil: 'load' }).catch(() => null);
  132 |       
  133 |       if (response && response.status() === 200) {
  134 |         const backButton = page.getByRole('button', { name: /back/i });
> 135 |         await expect(backButton).toBeVisible();
      |                                  ^ Error: expect(locator).toBeVisible() failed
  136 |       }
  137 |     });
  138 |   });
  139 | });
  140 | 
```