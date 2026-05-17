# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> Homepage >> Accessibility >> should have sufficient color contrast
- Location: tests/e2e/homepage.spec.ts:130:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]: Page Studio
        - generic [ref=e6]:
          - button "publisher" [ref=e8]:
            - generic [ref=e9]: publisher
            - img [ref=e10]
          - link "Open Editor" [ref=e12] [cursor=pointer]:
            - /url: /editor
            - button "Open Editor" [ref=e13]:
              - text: Open Editor
              - img
    - generic [ref=e16]:
      - heading "Visual Page Builder" [level=1] [ref=e17]
      - paragraph [ref=e18]: Create stunning pages with a powerful drag-and-drop editor. Powered by Contentful CMS and built with production-ready code.
      - link "Start Building" [ref=e20] [cursor=pointer]:
        - /url: /editor
        - button "Start Building" [ref=e21]:
          - text: Start Building
          - img
    - generic [ref=e23]:
      - heading "Published Pages" [level=2] [ref=e24]
      - generic [ref=e25]:
        - paragraph [ref=e26]: No published pages yet.
        - paragraph [ref=e27]: Create and publish pages using the editor to see them here.
    - generic [ref=e29]:
      - heading "Powerful Features" [level=2] [ref=e30]
      - generic [ref=e31]:
        - generic [ref=e32]:
          - img [ref=e34]
          - heading "Drag & Drop" [level=3] [ref=e36]
          - paragraph [ref=e37]: Intuitive drag-and-drop editor to build pages without writing code.
        - generic [ref=e38]:
          - img [ref=e40]
          - heading "Reusable Components" [level=3] [ref=e44]
          - paragraph [ref=e45]: "Rich library of pre-built components: buttons, cards, sections, and more."
        - generic [ref=e46]:
          - img [ref=e48]
          - heading "Contentful CMS" [level=3] [ref=e52]
          - paragraph [ref=e53]: Real CMS integration. Manage content, publish pages, and maintain versions.
    - generic [ref=e55]:
      - heading "Built with Modern Tech" [level=2] [ref=e56]
      - generic [ref=e57]:
        - generic [ref=e58]:
          - paragraph [ref=e59]: Next.js 16
          - paragraph [ref=e60]: Latest React framework
        - generic [ref=e61]:
          - paragraph [ref=e62]: TypeScript
          - paragraph [ref=e63]: Full type safety
        - generic [ref=e64]:
          - paragraph [ref=e65]: Tailwind CSS
          - paragraph [ref=e66]: Utility-first styling
        - generic [ref=e67]:
          - paragraph [ref=e68]: Contentful
          - paragraph [ref=e69]: Headless CMS
        - generic [ref=e70]:
          - paragraph [ref=e71]: Redux Toolkit
          - paragraph [ref=e72]: State management
        - generic [ref=e73]:
          - paragraph [ref=e74]: React Hook Form
          - paragraph [ref=e75]: Form handling
        - generic [ref=e76]:
          - paragraph [ref=e77]: Zod
          - paragraph [ref=e78]: Schema validation
        - generic [ref=e79]:
          - paragraph [ref=e80]: Playwright
          - paragraph [ref=e81]: E2E testing
    - generic [ref=e83]:
      - heading "Ready to build?" [level=2] [ref=e84]
      - paragraph [ref=e85]: Create beautiful pages with our visual editor. No coding required.
      - link "Open Editor" [ref=e86] [cursor=pointer]:
        - /url: /editor
        - button "Open Editor" [ref=e87]:
          - text: Open Editor
          - img
    - generic [ref=e89]:
      - generic [ref=e90]:
        - generic [ref=e91]:
          - paragraph [ref=e92]: Page Studio
          - paragraph [ref=e93]: Professional visual page builder.
        - generic [ref=e94]:
          - paragraph [ref=e95]: Product
          - list [ref=e96]:
            - listitem [ref=e97]:
              - link "Features" [ref=e98] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e99]:
              - link "Pricing" [ref=e100] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e101]:
              - link "Docs" [ref=e102] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e103]:
          - paragraph [ref=e104]: Company
          - list [ref=e105]:
            - listitem [ref=e106]:
              - link "About" [ref=e107] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e108]:
              - link "Blog" [ref=e109] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e110]:
              - link "Contact" [ref=e111] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e112]:
          - paragraph [ref=e113]: Legal
          - list [ref=e114]:
            - listitem [ref=e115]:
              - link "Privacy" [ref=e116] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e117]:
              - link "Terms" [ref=e118] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e119]:
              - link "License" [ref=e120] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e121]:
        - paragraph [ref=e122]: © 2024 Page Studio. All rights reserved.
        - paragraph [ref=e123]: Built with Next.js, TypeScript, and Contentful.
  - alert [ref=e124]
```

# Test source

```ts
  36  |   test.describe('Navigation', () => {
  37  |     test('should have editor link', async ({ page }) => {
  38  |       const editorLink = page.getByRole('link', { name: /editor|create/i });
  39  |       const linkExists = await editorLink.count() > 0;
  40  |       expect(linkExists).toBe(true);
  41  |     });
  42  | 
  43  |     test('should navigate to editor when clicked', async ({ page }) => {
  44  |       const editorLink = page.getByRole('link', { name: /editor|create/i }).first();
  45  |       if (await editorLink.count() > 0) {
  46  |         await editorLink.click();
  47  |         await page.waitForURL(/.*editor.*/i);
  48  |         expect(page.url()).toContain('/editor');
  49  |       }
  50  |     });
  51  |   });
  52  | 
  53  |   test.describe('Published Pages Display', () => {
  54  |     test('should show published pages if available', async ({ page }) => {
  55  |       // Try to find published page cards
  56  |       const pageCards = page.locator('[data-testid="published-page-card"]');
  57  |       const cardCount = await pageCards.count();
  58  | 
  59  |       if (cardCount > 0) {
  60  |         // If cards exist, they should be visible
  61  |         await expect(pageCards.first()).toBeVisible();
  62  |       }
  63  |     });
  64  | 
  65  |     test('should have preview button for published pages', async ({ page }) => {
  66  |       const previewButtons = page.getByRole('link', { name: /preview/i });
  67  |       const count = await previewButtons.count();
  68  | 
  69  |       if (count > 0) {
  70  |         const firstButton = previewButtons.first();
  71  |         await expect(firstButton).toBeVisible();
  72  |         expect(firstButton).toHaveAttribute('href', /\/preview\//);
  73  |       }
  74  |     });
  75  | 
  76  |     test('should have view button for published pages', async ({ page }) => {
  77  |       const viewButtons = page.getByRole('link', { name: /view/i });
  78  |       const count = await viewButtons.count();
  79  | 
  80  |       if (count > 0) {
  81  |         const firstButton = viewButtons.first();
  82  |         await expect(firstButton).toBeVisible();
  83  |       }
  84  |     });
  85  |   });
  86  | 
  87  |   test.describe('Accessibility', () => {
  88  |     test('should have no accessibility violations', async ({ page }) => {
  89  |       await injectAxe(page);
  90  |       await checkA11y(page);
  91  |     });
  92  | 
  93  |     test('should have proper heading hierarchy', async ({ page }) => {
  94  |       const h1s = page.getByRole('heading', { level: 1 });
  95  |       const h1Count = await h1s.count();
  96  | 
  97  |       // Should have at least one H1
  98  |       expect(h1Count).toBeGreaterThan(0);
  99  |     });
  100 | 
  101 |     test('should have alt text on images', async ({ page }) => {
  102 |       const images = page.locator('img');
  103 |       const imageCount = await images.count();
  104 | 
  105 |       if (imageCount > 0) {
  106 |         // All images should have alt text
  107 |         for (let i = 0; i < imageCount; i++) {
  108 |           const img = images.nth(i);
  109 |           const alt = await img.getAttribute('alt');
  110 |           expect(alt).toBeTruthy();
  111 |         }
  112 |       }
  113 |     });
  114 | 
  115 |     test('should have accessible links', async ({ page }) => {
  116 |       const links = page.getByRole('link');
  117 |       const linkCount = await links.count();
  118 | 
  119 |       if (linkCount > 0) {
  120 |         // All links should have accessible text
  121 |         for (let i = 0; i < Math.min(linkCount, 5); i++) {
  122 |           const link = links.nth(i);
  123 |           const text = await link.textContent();
  124 |           const ariaLabel = await link.getAttribute('aria-label');
  125 |           expect(text || ariaLabel).toBeTruthy();
  126 |         }
  127 |       }
  128 |     });
  129 | 
  130 |     test('should have sufficient color contrast', async ({ page }) => {
  131 |       await injectAxe(page);
  132 |       const results = await page.evaluate(() => {
  133 |         return (window as any).axe.run({ runOnly: { type: 'rule', values: ['color-contrast'] } });
  134 |       });
  135 | 
> 136 |       expect(results.violations.length).toBe(0);
      |                                         ^ Error: expect(received).toBe(expected) // Object.is equality
  137 |     });
  138 |   });
  139 | 
  140 |   test.describe('Responsive Design', () => {
  141 |     test('should be responsive on mobile', async ({ page }) => {
  142 |       await page.setViewportSize({ width: 375, height: 667 });
  143 |       await page.goto('/');
  144 | 
  145 |       const heading = page.getByRole('heading', { level: 1 });
  146 |       await expect(heading).toBeVisible();
  147 |     });
  148 | 
  149 |     test('should be responsive on tablet', async ({ page }) => {
  150 |       await page.setViewportSize({ width: 768, height: 1024 });
  151 |       await page.goto('/');
  152 | 
  153 |       const heading = page.getByRole('heading', { level: 1 });
  154 |       await expect(heading).toBeVisible();
  155 |     });
  156 | 
  157 |     test('should be responsive on desktop', async ({ page }) => {
  158 |       await page.setViewportSize({ width: 1920, height: 1080 });
  159 |       await page.goto('/');
  160 | 
  161 |       const heading = page.getByRole('heading', { level: 1 });
  162 |       await expect(heading).toBeVisible();
  163 |     });
  164 |   });
  165 | 
  166 |   test.describe('Performance', () => {
  167 |     test('should load in reasonable time', async ({ page }) => {
  168 |       const startTime = Date.now();
  169 |       await page.goto('/');
  170 |       const loadTime = Date.now() - startTime;
  171 | 
  172 |       // Page should load within 3 seconds
  173 |       expect(loadTime).toBeLessThan(3000);
  174 |     });
  175 |   });
  176 | });
  177 | 
```