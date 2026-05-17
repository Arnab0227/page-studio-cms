# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> Homepage >> Accessibility >> should have no accessibility violations
- Location: tests/e2e/homepage.spec.ts:88:9

# Error details

```
AssertionError: 1 accessibility violation was detected

1 !== 0

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