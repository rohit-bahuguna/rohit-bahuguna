# AGENTS.md — Mandatory AI Agent Operating Directives
## Personal Portfolio & Headless CMS Architecture
### Workspace: /home/rohit-bahuguna/RB/rohit-bahuguna

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS (ANTIGRAVITY, CLAUDE, CURSOR, COPILOT):**  
> You are operating within a production full-stack Next.js and SQLite CMS application.  
> You **MUST NOT** take shortcuts, write hardcoded fallbacks, or bypass architectural rules. Read and obey these directives on **EVERY SINGLE TURN**.

---

## 1. Rule 0: Pre-Change Rule Verification Gate
- **Before making ANY code, design, configuration, or architectural change, AI agents MUST explicitly review, verify, and apply ALL operational directives and Clean Code standards FIRST.**
- AI agents are **STRICTLY PROHIBITED** from taking shortcuts, introducing temporary workarounds, or writing code before validating all repository rules.
- Every turn begins with a rule compliance check: If an action would violate ANY directive in this document, the agent **MUST NOT** proceed with the violation.

---

## 2. Rule 1: Zero Static Data & Zero Fallback Law (Database-First Primacy)
- **STRICT PROHIBITION ON COMPONENT-LEVEL FALLBACKS:**
  AI agents and developers are **STRICTLY FORBIDDEN** from introducing hardcoded fallback objects, fallback arrays, or static mock values (such as `DEFAULT_SOCIALS`, `DEFAULT_NAV`, `DEFAULT_PARAGRAPHS`, `data?.name || "Rohit"`, or fallback image paths) directly inside UI components (`Header.tsx`, `HeroSection.tsx`, `About.tsx`, `Skills.tsx`, `Project.tsx`, `Contact.tsx`, `Footer.tsx`).
- **Single Source of Truth:**
  - ALL domain entities, section headlines, biography paragraphs, career journey milestones, project showcases, taxonomy skills, direct contact channels, and footer links **MUST** be fetched dynamically from the database (`SiteConfig`, `Project`, `Skill`, `Media` via Prisma & SQLite).
  - If data is absent or null, components MUST render clean empty states or omit the elements gracefully—**NEVER** substitute with hardcoded dummy fixtures.
- **Canonical Seeding Law:**
  - All default and initial platform data lives exclusively in [`prisma/seed.ts`](file:///home/rohit-bahuguna/RB/rohit-bahuguna/prisma/seed.ts).
  - When initializing a new environment or resetting state, `npx tsx prisma/seed.ts` populates both `live` and `draft` database rows. Never duplicate seed data inside component source code.

---

## 3. Rule 2: Dynamic Rendering Law for Live / Draft Preview
- **No Stale Static Caching for Live/Draft State:**
  - Root pages and dynamic views that support preview mode (`/?preview=true`) **MUST** declare:
    ```typescript
    export const dynamic = "force-dynamic";
    export const revalidate = 0;
    ```
  - This ensures Next.js dynamically evaluates requests at runtime, reads the admin session cookie, and fetches fresh staged draft data from SQLite without serving stale build-time static cache.

---

## 4. Rule 3: Single Gateway Preview-Before-Publish Law
- **Mandatory Preview Verification:**
  - The CMS dashboard and top bar **MUST NOT** offer direct one-click bypass publishing from section editors.
  - Clicking "Publish Live" in the CMS top bar automatically saves any pending unsaved changes and redirects the admin to the **Preview Page** (`/?preview=true`).
  - The Preview Page top banner ([`AdminPreviewBanner.tsx`](file:///home/rohit-bahuguna/RB/rohit-bahuguna/app/components/AdminPreviewBanner.tsx)) is the **ONLY** authorized source from which drafts can be promoted to the live website.
- **Post-Publish Destination:**
  - After clicking "Publish to Live Site" and invalidating ISR/edge caches, the system **MUST redirect back to the CMS Dashboard** (`/admin-vault/dashboard`), NOT the public site.

---

## 5. Rule 4: Unsaved Changes Navigation Guard Law
- **No Accidental Data Loss:**
  - All CMS section editors MUST maintain dirty state tracking (`isDirty`).
  - If a user has unsaved modifications and clicks any sidebar navigation tab or external link, the transition **MUST** be intercepted by [`UnsavedChangesModal.tsx`](file:///home/rohit-bahuguna/RB/rohit-bahuguna/app/components/admin/UnsavedChangesModal.tsx) presenting three explicit options:
    1. **Save**: Persists the changes to draft, then navigates to the requested tab.
    2. **Discard**: Reverts local changes, then navigates to the requested tab.
    3. **Cancel**: Aborts navigation, preserves unsaved changes, and stays on the current tab.
  - Browser reloads and tab closures must be guarded with `beforeunload`.

---

## 6. Rule 5: Non-Blocking Notifications & UI Action Primacy
- **Action Buttons Always Visible:**
  - CMS action buttons (Save Changes, Publish Live) MUST remain permanently visible in the viewport (`sticky` or `fixed`) and must never scroll out of view.
- **Toast Positioning:**
  - Toast notifications (`react-hot-toast`) **MUST** be positioned at `bottom-right` (or `bottom-center`).
  - Toasts are **STRICTLY PROHIBITED** from appearing at `top-right` where they block or obscure top action buttons.
  - All toasts must auto-dismiss within **5 seconds** and display an animated countdown progress bar.

---

## 7. Rule 6: Minimal Design System Architecture
- Follow [`holger1411/minimal-design-system-skill`](https://github.com/holger1411/minimal-design-system-skill) strictly:
  - Monochrome Zinc / Slate palette using shadcn HSL design tokens (`hsl(var(--background))`, `hsl(var(--foreground))`, `hsl(var(--card))`, etc.).
  - Default theme is **Dark Mode** across the entire application with accessible light mode toggling via [`ThemeProvider.tsx`](file:///home/rohit-bahuguna/RB/rohit-bahuguna/app/components/ThemeProvider.tsx).
  - Subtle `1px` borders, generous whitespace, clean Geist/Inter typography.
  - **Zero Neobrutalism**: Never reintroduce thick 3px black borders or harsh drop shadows.
  - **Signature Logo Contrast**: Brand signature images MUST use `brightness-0 contrast-200 dark:invert` so the logo is solid black in light mode and solid white in dark mode.

---

## 8. Rule 7: Strict Type Safety & Clean Code Standards
- **Zero `any` / Zero `@ts-ignore`:** Every API route, model, and component prop MUST be strongly typed.
- **Command Architecture:**
  - Because of local IPv6 routing in this environment, all Node/npm commands **MUST** include:
    ```bash
    NODE_OPTIONS="--dns-result-order=ipv6first"
    ```
  - Verify every change with `npx tsc --noEmit` and `npm run build` before reporting completion.
