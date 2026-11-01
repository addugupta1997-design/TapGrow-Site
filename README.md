# Local Business Growth Planner

A free, private, deterministic marketing workspace and action planner for independent local businesses worldwide.

## 🎯 Product Overview

Local Business Growth Planner helps owners of retail shops, restaurants, salons, clinics, and home trade businesses identify high-impact marketing actions without hiring an agency or buying expensive software subscriptions.

### Core Value Proposition
> "Know what to improve, what to do next, and how to track your local business marketing progress."

### Key Constraints & Principles
- **₹0 Cost**: No paid APIs, no API keys, and no subscriptions.
- **Privacy by Design**: No mandatory login, signup, email, or passwords. All assessment responses and task notes remain 100% in the user's browser via versioned `localStorage`.
- **Deterministic Logic**: Recommendations and marketing readiness scores are calculated by transparent, testable TypeScript rules—not ungrounded AI chat output.
- **No Fabricated Data**: Zero fake metrics, simulated rankings, or artificial visitor counters.
- **Portability**: Download complete plans as JSON backup or print clean reports / Save as PDF.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript (strict typing)
- **Bundler & Tooling**: Vite + tsx (for unit test execution)
- **Styling**: Tailwind CSS v4 + Design Tokens (Deep navy `#142A36`, Primary green `#16866F`, Light green `#DFF5EA`, Page background `#F6F8F7`)
- **Icons**: Lucide React
- **Persistence**: HTML5 `localStorage` with versioned schema, error recovery, and in-memory fallback
- **Test Runner**: Node.js built-in test runner (`node:test` + `node:assert/strict`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The app will run at `http://localhost:3000`.

### 3. Run Automated Unit Tests
```bash
npm test
# or:
npx --yes tsx --test src/**/*.test.ts
```

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📐 Architecture & Modular Structure

```
src/
  types/
    assessment.ts           # Questionnaire answers, enums, validation errors
    recommendations.ts      # Template schema, priority definitions, score result
    storage.ts              # LocalStorage schema versioning (v1)
  lib/
    validation.ts           # Step-by-step form validation, URL sanitization, XSS guards
    storage.ts              # Resilient storage with schema validation & corrupt-data recovery
    exportData.ts           # JSON backup downloader & browser Save as PDF printer
    dateUtils.ts            # Locale-aware date formatting
  features/
    assessment/
      AssessmentWizard.tsx  # Multi-step questionnaire controller
      Step1Basics.tsx       # Business category, location, business model
      Step2OnlinePresence.tsx # Website, Google Business Profile, social channels
      Step3Foundations.tsx  # Customer discovery, NAP consistency, review routine
      Step4Goals.tsx        # Growth goal, weekly available hours, budget preference
    recommendations/
      recommendationCatalog.ts # 16 curated templates with explicit completion criteria
      recommendationRules.ts   # Conditional logic & business model filters
      scoring.ts            # Normalized 0-100 Readiness Score with fair denominator handling
      generateRecommendations.ts # Rule evaluation, priority sorting & weekly grouping
    dashboard/
      DashboardPage.tsx     # Main dashboard workspace & action toolbar
      DashboardSummary.tsx  # KPI cards (Readiness, Actions, Completed, Progress)
      TaskList.tsx          # Real-time search, priority, category & status filters
      TaskCard.tsx          # Expandable instructions, why it matters, notes persistence
      WeeklyFocusView.tsx   # Week 1, 2, 3, 4+ manageable sprints
      ScoreExplainerModal.tsx # Transparent breakdown of self-assessment calculation
    landing/
      LandingPage.tsx       # Public overview, sample task card, honest FAQ
  pages/
    HowItWorksPage.tsx      # Methodology & weekly pacing guide
    AboutPage.tsx           # Mission & commitments
    PrivacyPage.tsx         # Transparent local storage privacy notice
    NotFoundPage.tsx        # 404 recovery view
  components/
    AppHeader.tsx           # Accessible 3-zone Top Bar Contract
    AppFooter.tsx           # Zero-telemetry footer with legal & site links
    ConfirmDialog.tsx       # Accessible modal for destructive state actions
    ProgressBar.tsx         # Accessible progress bar
    EmptyState.tsx          # Clear guidance when filters yield zero items
```

---

## 📊 Scoring & Recommendation Rules

1. **Readiness Score (0–100)**:
   - Evaluates foundational visibility assets (business listing, NAP consistency, review invite habit, website clarity, primary call-to-action, content updates, lead tracking).
   - Excludes non-applicable dimensions (e.g. physical map listings for online-only businesses) from the denominator so businesses are never unfairly penalized.
2. **Prioritization Rules**:
   - **High Priority**: Foundational gaps that directly prevent nearby customers from finding, calling, or visiting.
   - **Medium Priority**: Conversion boosters, secondary listings (Apple Maps, Bing Places), and review responses.
   - **Low Priority**: Advanced technical optimizations (LocalBusiness Schema) and offline cross-promotions.
3. **Weekly Pacing**:
   - Tasks are automatically organized into Week 1 (Foundations), Week 2 (Conversions & Directories), Week 3 (Social & Content), and Week 4+ (Measurement & Habits).

---

## 🌐 Free Static Deployment Guide

Because the application is a pure client-side SPA with zero server dependencies:

### Option A: Cloudflare Pages (Free)
1. Push code to GitHub/GitLab.
2. Create a new Cloudflare Pages project.
3. Build command: `npm run build`
4. Build output directory: `dist`

### Option B: Netlify / Vercel (Free)
1. Import repository.
2. Framework preset: `Vite`
3. Build command: `npm run build`
4. Publish directory: `dist`

### Option C: GitHub Pages (Free)
1. Set `base: './'` in `vite.config.ts`.
2. Deploy `dist/` directory via GitHub Actions static pages workflow.

---

## ⚠️ Known Limitations & Boundaries

1. **Self-Assessment vs. Live Crawling**: This MVP is a self-assessment based on answers provided by the business owner. It does not actively crawl private websites or query live Google Maps APIs (which would require paid API keys and server infrastructure).
2. **Device-Specific Storage**: Data is saved in the current browser's local storage. To transfer progress between devices, use the "Export JSON" feature to save a backup file.
3. **Single Language Initial Launch**: The MVP launches with English copy organized in centralized translation dictionaries (`src/locales/en.ts`) prepared for future internationalization.
