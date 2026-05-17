# Page Studio – Schema Driven Landing Page Builder

A schema-driven landing page studio built with Next.js App Router, TypeScript, Redux Toolkit, Contentful, Tailwind CSS, and shadcn/ui.

The project allows authorized users to:

* Load pages from Contentful
* Edit pages visually in a lightweight studio
* Preview draft pages
* Publish immutable versioned releases
* Manage release history and rollback flows
* Enforce accessibility and quality through automated testing

---

# Notes About the Implementation

This was my first time working with Contentful and understanding its content modeling and preview/published workflows. I used AI assistance during the project to:

* understand certain Contentful integration patterns
* generate some boilerplate code
* accelerate repetitive setup work
* help structure some test cases
* validate architectural approaches

However, the implementation logic, architecture decisions, publishing workflow design, SemVer strategy, editor behavior, rendering flow, and feature-level problem solving were designed and implemented by me.

AI was used as an assistant/tool during development, not as a replacement for the actual engineering and architectural decisions behind the project.

---

# Tech Stack

* Next.js (App Router)
* TypeScript
* Redux Toolkit
* Contentful
* Tailwind CSS
* shadcn/ui
* Zod
* Playwright
* axe-core
* GitHub Actions

---

# Features

## Schema Driven Renderer

* Typed section registry architecture
* Dynamic section rendering
* Zod schema validation
* Unsupported section fallback rendering
* Error boundaries for invalid schemas

## Studio Editor

* Add/Edit/Reorder sections
* Redux managed editor state
* Draft persistence
* Live preview support
* Layout preservation between editor and published pages

## Contentful Integration

* Real Contentful API integration
* Draft vs published mode support
* Isolated adapter architecture
* No CMS logic leaking into UI components

## Immutable Publishing System

* Deterministic SemVer publishing
* Immutable JSON release snapshots
* Release history
* Rollback support
* Idempotent publishing

Example release structure:

releases/
home/
1.0.0.json
1.0.1.json
1.1.0.json

pricing/
1.0.0.json

## RBAC

Roles implemented:

* viewer
* editor
* publisher

Permissions are enforced at:

* route level
* server action level
* publish flow level

## Accessibility

WCAG-oriented implementation:

* keyboard accessibility
* visible focus states
* semantic hierarchy
* labelled forms
* reduced motion support

## Testing

Implemented:

* unit tests
* semver logic tests
* schema validation tests
* Playwright smoke tests
* axe accessibility tests

CI pipeline validates:

* linting
* type safety
* tests
* accessibility violations

---

# Running the Project

## Install dependencies

npm install

## Configure environment variables

Create:

.env.local

Add:

NEXT_PUBLIC_CONTENTFUL_SPACE_ID=
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_PREVIEW_ACCESS_TOKEN=

## Run development server

npm run dev

---

# Testing

Run unit tests:

npm run test

Run Playwright tests:

npm run test:e2e

---

# Key Architectural Focus Areas

* Schema safety
* Deterministic publishing
* Immutable release architecture
* Separation of concerns
* Accessibility-first implementation
* Redux state integrity
* Type safety
* Resilient rendering
* Automated quality enforcement

---

# Future Improvements

* Real authentication provider integration
* Multi-user collaboration
* Drag-and-drop layout engine
* Visual responsive editor
* Release comparison UI
* Component versioning
* Real-time preview sync
* Advanced rollback management

---
