# FormCraft — Tally.so-Inspired Document-Style Form Builder

A modern, minimal, and fully functional document-style form builder built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. Inspired by [Tally.so](https://tally.so/), FormCraft allows users to create forms naturally like writing a document, configure blocks dynamically, test live responsive previews, publish forms, collect submissions, and inspect saved responses.

---

## 📸 Screenshots & UI Showcase

> *To capture actual screenshots for submission or portfolio:*
> 1. Start the dev server (`npm run dev`) and visit `http://localhost:5173/`.
> 2. Capture the Dashboard (`public/screenshots/dashboard.png`).
> 3. Capture the Document-Style Form Builder (`public/screenshots/editor.png`).
> 4. Capture the Multi-Device Preview (`public/screenshots/preview.png`).
> 5. Capture the Public Form Filling View (`public/screenshots/public_form.png`).
> 6. Capture the Response Analytics Viewer (`public/screenshots/responses.png`).

```
┌────────────────────────────────────────────────────────────────────────┐
│  FormCraft Dashboard [EN / हिंदी]               [+ Create New Form]    │
│  ────────────────────────────────────────────────────────────────────  │
│  [Total Forms: 2]   [Published: 1]   [Collected Responses: 5]         │
│  ────────────────────────────────────────────────────────────────────  │
│  ┌───────────────────────┐ ┌───────────────────────┐                  │
│  │ Product Feedback      │ │ Contact Inquiry       │                  │
│  │ ● Published           │ │ ○ Draft               │                  │
│  │ 5 Responses           │ │ 0 Responses           │                  │
│  │ [Edit] [Preview] [🔗]  │ │ [Edit] [Preview]      │                  │
│  └───────────────────────┘ └───────────────────────┘                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Technology Stack

- **Core Framework**: React 19 with TypeScript (~6.0)
- **Build Tool**: Vite 8.3
- **Styling**: Tailwind CSS 3.4 with custom design tokens, micro-animations, and responsive layouts
- **Routing**: React Router DOM (v7)
- **Form Management & Validation**: React Hook Form with accessible ARIA attributes
- **Icons**: Lucide React
- **Internationalization (i18n)**: `i18next` & `react-i18next` supporting **English (en)** and **Hindi (hi)**
- **Localization Formatting**: Native `Intl.DateTimeFormat` and `Intl.NumberFormat`
- **Persistence Layer**: Structured `storageService` abstraction over browser `localStorage`
- **Testing**: Vitest & React Testing Library with JSDOM

---

## 🛠️ Installation & Getting Started

### Prerequisites
- Node.js (v18+ recommended, tested on Node v24.18)
- npm (v9+)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Assessment-tally

# Install dependencies
npm install
```

### Running Locally (Development)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Unit & Integration Tests
```bash
npm test
```
Runs the Vitest test suite covering storage CRUD, schema rendering, input validation, internationalization, and end-to-end user journeys.

### Production Build
```bash
npm run build
```
Compiles TypeScript with strict type checking (`tsc -b`) and bundles production assets via Vite.

---

## 🌐 Application Routes

| Route | View | Description |
|---|---|---|
| `/` | `DashboardPage` | Displays saved forms, search/filter, statistics, and form actions (edit, duplicate, delete, preview) |
| `/edit/:id` | `FormEditorPage` | 3-column document-style form builder with blocks palette, canvas, and properties inspector |
| `/preview/:id` | `FormPreviewPage` | Interactive form preview with Desktop / Tablet / Mobile viewport switcher |
| `/forms/:id` | `PublicFormPage` | Clean, public respondent-facing form filling interface with double-submission lock |
| `/forms/:id/submissions` | `SubmissionsPage` | Tabular response viewer with JSON export and response deletion |
| `*` | `NotFoundPage` | 404 page for unmatched routes |

---

## 🧱 Supported Form Blocks (13 Types)

1. **Heading**: H1, H2, or H3 section titles with optional subtitle descriptions
2. **Paragraph**: Formatted instructional and context text
3. **Short Text**: Single-line text answers with placeholder and required toggles
4. **Long Text**: Multi-line expandable textarea
5. **Email**: RFC-compliant email address validation
6. **Number**: Numeric inputs with optional min, max, and step constraints
7. **Multiple Choice**: Radio button options with custom choice editing
8. **Dropdown**: Single selection select menu
9. **Single Checkbox**: Agreement, consent, or confirmation checkbox
10. **Multiple Checkboxes**: Multi-option checkbox list
11. **Date**: HTML5 date picker with range bounds
12. **Rating**: Interactive star rating (1 to 5 or 1 to 10 scale)
13. **Submit Button**: Customizable button text and alignment (left, center, right, full)

---

## 🧬 Form Schema Design

All forms are modeled as schema-driven JSON objects:

```typescript
export interface FormSchema {
  id: string;                      // Stable unique ID (e.g. form_7f8a9b)
  title: string;                   // Form title
  description: string;             // Form header instructions
  status: 'draft' | 'published';   // Publishing state
  locale?: string;                 // Default locale ('en' | 'hi')
  blocks: FormBlock[];             // Ordered list of block elements
  settings?: FormSettings;         // Button text, success message, etc.
  createdAt: string;               // ISO 8601 timestamp
  updatedAt: string;               // ISO 8601 timestamp
}

export interface FormBlock {
  id: string;                      // Stable unique ID (never array index)
  type: BlockType;                 // e.g. 'shortText', 'rating', 'multipleChoice'
  label: string;                   // Question or block label
  description?: string;            // Help text
  placeholder?: string;            // Field placeholder
  required?: boolean;              // Validation rule
  config?: BlockConfig;            // Options, min/max, rating scale, etc.
}
```

---

## ⚡ Dynamic Form Rendering (`DynamicFormRenderer.tsx`)

The centerpiece of FormCraft is `DynamicFormRenderer.tsx`:
- **Shared Architecture**: The exact same dynamic rendering engine powers both the **Form Preview** and the **Public Form Page**, guaranteeing zero drift between design and respondent experience.
- **Order Preservation**: Iterates over `form.blocks` in their exact stored sequence.
- **Graceful Fallbacks**: If an unrecognized or legacy block type is encountered, a non-breaking fallback notice is displayed instead of crashing the UI.
- **Validation**: Enforces required fields, email formatting, number ranges, and rating selections using React Hook Form and accessible `role="alert"` messages.
- **Double-Submission Prevention**: Disables the submit action during inflight processing to prevent duplicate records.

---

## 💾 Storage Strategy & Data Persistence

FormCraft utilizes an abstracted `StorageService` (`src/services/storageService.ts`):
- **Defensive Parsing**: Validates stored JSON on read; malformed records fall back to seeds without crashing the application.
- **Cascade Deletion**: Deleting a form removes all associated responses, preventing orphaned records.
- **Deep Duplication**: Cloning a form generates brand new unique IDs for the form, every block, and every choice option.
- **Debounced Autosave**: In the editor, state updates trigger a 600ms debounced save with live UI feedback ("Saving...", "Autosaved at HH:MM:SS", or "Save Error").

### Persistence Assumptions & Limitations
- **Browser-Specific**: `localStorage` is scoped to the respondent's current browser and device. Data is not synchronized across different devices or browsers.
- **Single-User Scope**: Designed for single-tenant local evaluation. Concurrent multi-tab edits overwrite the latest snapshot.
- **Production Roadmap**: The `StorageService` interface is deliberately designed so it can be swapped for a REST/GraphQL backend connected to PostgreSQL or MongoDB with zero changes to UI components.
- **Published URLs**: Form publishing switches the form status to `published` so the public route `/forms/:id` can accept responses. It does not provide server-side encryption or access token authentication.

---

## 🌍 Internationalization (I18N) vs Localization (L10N)

FormCraft implements comprehensive bilingual support in **English** and **Hindi**:

### Distinction
- **Internationalization (I18N)**: The engineering foundation that designs software to support multiple languages and regions without code modifications. Implemented via `i18next`, resource bundles (`en.json`, `hi.json`), and dynamic translation hooks (`useTranslation`).
- **Localization (L10N)**: The adaptation of content and formatting for a specific geographic locale. Implemented using standard browser `Intl` APIs (`Intl.DateTimeFormat` for dates and `Intl.NumberFormat` for numbers) formatted for `en-US` and `hi-IN`.

### Features
- Visible top-level Language Selector (`EN` / `हिंदी`).
- User language preference saved in `localStorage` (`formcraft_language`) and restored on refresh.
- Complete interface translation (dashboard, navigation, editor controls, property labels, empty states, modals, and error messages).
- **Separation of Concerns**: User-authored form questions and answers remain unaltered when switching the interface language.

---

## 📱 Responsive Layout Strategy

- **Desktop (1440px+)**: Full 3-column layout (Blocks Palette on left, document canvas in center, property inspector on right).
- **Laptop (1024px)**: Proportional 3-column layout with optimized spacing.
- **Tablet & Mobile (320px – 768px)**: Seamless tabbed view (`Blocks`, `Canvas`, `Properties`) preventing cramped panels or horizontal overflow.
- **Preview Device Emulator**: Dedicated viewport switcher allowing creators to test forms as viewed on Desktop, Tablet, and Mobile screens.

---

## 🧪 Testing Summary

Run tests via:
```bash
npm test
```
The test suite consists of **15 automated tests** across 4 suites:
- `storageService.test.ts`: Form CRUD, seed initialization, updates, deep duplication, submission tracking, and malformed JSON recovery.
- `DynamicFormRenderer.test.tsx`: Schema-to-DOM rendering, required field validation, RFC email validation, and successful submission handling.
- `i18n.test.ts`: Language switching between English and Hindi and preference persistence.
- `userJourney.test.tsx`: End-to-end user journey simulation (Create → Add Blocks → Configure → Preview → Save → Reopen → Publish → Submit Response → View Response).

---

## 💼 Interview Demonstration Guide

When presenting FormCraft to the hiring team:
1. **Dashboard & Seeds**: Showcase the dashboard with preloaded seed forms, search bar, status filters (All, Published, Draft), and response counters.
2. **Language Toggle**: Switch between English and Hindi in the top bar to show instant, reactive localization.
3. **Form Creation**: Click "Create Form" to open the document-style canvas.
4. **Document-Style Canvas**: Demonstrate inline editing of the form title and questions without opening modals.
5. **Add & Configure Blocks**: Add a Rating and Multiple Choice block from the left palette; customize options and required rules in the right panel.
6. **Autosave Verification**: Highlight the "Autosaved at..." indicator in the header. Refresh the page to show total persistence.
7. **Multi-Device Preview**: Switch viewports (Desktop, Tablet, Mobile) and submit a test response.
8. **Publishing**: Click "Publish" and copy the public form link. Open `/forms/:id` to show the clean public respondent view.
9. **Responses Table**: Navigate to `/forms/:id/submissions` to demonstrate real-time response capture, tabular viewer, and JSON export.
