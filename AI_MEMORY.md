# AI_MEMORY.md — FormCraft Architecture & Conventions

## 1. Project Overview & Architecture
FormCraft is a high-craft, Tally.so-inspired document-style form builder built for an assessment by Naikroop Solutions. It is implemented as a single-page application using:
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **State & Persistence**: LocalStorage-backed `StorageService`
- **Form System**: React Hook Form with `DynamicFormRenderer`
- **Localization**: `i18next` + `react-i18next` with English (`en`) and Hindi (`hi`)
- **Navigation**: React Router DOM (v7)

## 2. Key Design Decisions & Conventions
- **Schema-Driven Rendering**: Forms are stored as JSON schemas (`FormSchema`), where blocks have stable unique IDs (never array indexes).
- **Dual-Purpose Renderer**: `DynamicFormRenderer.tsx` is shared between Preview (`/preview/:id`) and Public Submission (`/forms/:id`) to prevent design drift.
- **Debounced Autosave**: `FormEditorPage` uses a 600ms debounce to save to `storageService.updateForm`, accompanied by an indicator: `saving`, `saved`, `error`.
- **Defensive Storage**: All `localStorage` operations are encapsulated in `StorageService`. Corrupted JSON or empty storage recovers with seed forms without throwing unhandled exceptions.
- **Type-Only Imports**: The project enforces `"verbatimModuleSyntax": true` in `tsconfig.app.json`, requiring `import type { ... }` for interfaces and types.
- **Internationalization (I18N)**: Translations live in `src/i18n/locales/{en,hi}.json`. User-authored form questions are decoupled from interface translations so language switches do not modify form titles or responses.
- **Responsive Layout**: Desktop displays a 3-column layout (Left: Blocks Palette, Center: Document Canvas, Right: Properties Panel). Mobile switches into tabbed views (`Blocks`, `Canvas`, `Properties`).

## 3. Supported Block Registry (13 Blocks)
1. `heading` (H1, H2, H3)
2. `paragraph` (rich descriptive text)
3. `shortText` (single line input)
4. `longText` (expandable textarea)
5. `email` (RFC format validation)
6. `number` (numeric with min/max)
7. `multipleChoice` (radio options)
8. `dropdown` (select dropdown)
9. `singleCheckbox` (consent/agreement)
10. `multipleCheckboxes` (multi-select)
11. `date` (date picker)
12. `rating` (interactive stars 1-5 or 1-10)
13. `submitButton` (custom label & alignment)

## 4. Completed Functionality
- **Dashboard**: Card view, metrics cards, search input, status filters, duplicate form, delete with confirm modal.
- **Form Editor**: Document canvas, inline label editing, add/delete/duplicate/reorder blocks, property inspector.
- **Form Preview**: Viewport emulator (Desktop, Tablet, Mobile), test submission handling.
- **Public Form**: Published status guard, validation, double-submission lock, thank-you screen.
- **Submissions**: Tabular response viewer, metrics, JSON export, single response deletion.
- **I18n**: English/Hindi switcher with localStorage persistence and native `Intl` date/number formatters.
