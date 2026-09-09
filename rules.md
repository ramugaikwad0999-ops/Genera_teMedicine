# Project Rules & AI Operating Guidelines

This document defines the strict engineering, architectural, and design rules that **all AI assistants and contributors must strictly adhere to** when modifying the **generaticMed** codebase.

---

## Cardinal Rule: Preserve Existing Functionality

> [!IMPORTANT]
> **NEVER BREAK EXISTING FUNCTIONALITY UNLESS EXPLICITLY REQUESTED BY THE USER.**
>
> 1. **Do not remove or alter working features**, components, mocks, or API signatures as a side-effect of introducing new code.
> 2. Always inspect all references across the codebase before modifying interfaces or shared utility methods.
> 3. Preserve dual-persona support: Ensure both `Patient` and `Enterprise` views remain fully functional and easily switchable.
> 4. If refactoring is necessary, maintain backwards compatibility and test both views before considering the task complete.

---

## 1. Coding Standards

### 1.1 TypeScript & Type Safety
- **Strict Mode Enabled**: Adhere to `tsconfig.json` compiler options (`strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`).
- **No Implicit `any`**: Explicitly type every function parameter, return type, and component prop. Avoid type assertions (`as any` or non-null assertions `!`) unless interacting with legacy third-party untyped modules.
- **Interface & Type Placement**:
  - Global domain types (`Drug`, `PharmacyStore`, `Order`, `DisputeCase`, `ViewMode`) must reside in [`src/types.ts`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/types.ts).
  - Component-specific prop interfaces may be declared locally in the component file (e.g., `interface CompareViewProps`).
- **Immutable Data Patterns**: Treat state as immutable. Use functional updates (`setCart(prev => [...])`) and spread operators when updating nested entities.

```typescript
// ✅ Good: Strongly typed with explicit interfaces
interface CartUpdaterProps {
  offer: DrugOffer;
  quantity: number;
  onSuccess: (updatedCart: CartItem[]) => void;
}

export const updateCartItem = ({ offer, quantity, onSuccess }: CartUpdaterProps): void => {
  // Logic
};

// ❌ Bad: Untyped or using 'any'
export const updateCartItem = (offer: any, qty: any) => { ... };
```

### 1.2 React 19 Best Practices
- **Functional Components**: Use arrow functions or function declarations with explicit `React.FC<Props>` or destructured props.
- **Hook Conventions**:
  - Keep hooks at the top level of component bodies.
  - Never place hooks inside loops, conditions, or nested functions.
  - Custom hooks must begin with the `use` prefix (e.g., `useDrugSearch`, `useStoreOffers`).
- **State Management**:
  - Use `useState` for local component UI state (modals, dropdown toggles, active sub-tabs).
  - Elevate shared application state to [`src/App.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/App.tsx) or dedicated React Context providers.
- **Performance**:
  - Use `useMemo` for computationally expensive filtering (such as drug catalog searching or sorting).
  - Use `useCallback` for callbacks passed to optimized child components.

### 1.3 Error Handling & Defensive Programming
- Wrap asynchronous logic, API integrations, and JSON parsing in `try/catch` blocks with clear error fallbacks.
- Provide user-facing toast notifications or inline error alerts (`AlertCircle`, `AlertTriangle`) instead of crashing the UI.

---

## 2. Folder Structure Rules

The codebase follows a modular, domain-driven structure under `src/`:

```
c:\Users\ACER\Downloads\Genera_teMedicine\
├── .env.example                # Canonical template for environment variables
├── index.html                  # HTML entry point with metadata and Google Fonts
├── metadata.json               # Cloud deployment and capability flags
├── package.json                # Dependencies and npm script targets
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite 6 + Tailwind v4 bundler configuration
└── src/
    ├── main.tsx                # React DOM root entry
    ├── App.tsx                 # Root application, persona router, top-level state
    ├── index.css               # Global Tailwind CSS imports and utility layers
    ├── types.ts                # Master domain interfaces and type definitions
    ├── components/
    │   ├── Navigation.tsx      # Dual-mode header, navigation tabs, mobile toggle
    │   ├── patient/            # Patient-facing customer experience
    │   │   ├── ExploreView.tsx          # Drug discovery, category pills, search
    │   │   ├── CompareView.tsx          # Buy-box comparison, 18-seller table
    │   │   ├── CartView.tsx             # Prescription review, checkout, escrow
    │   │   ├── OrderTrackingView.tsx    # Live courier map & RFID seal tracker
    │   │   └── PrescriptionUploadModal.tsx # AI OCR scan modal & verification
    │   └── enterprise/         # Multi-seller & administrative operations
    │       ├── EnterpriseLayout.tsx     # Enterprise header, sidebar, status pill
    │       ├── DashboardView.tsx        # KPI metrics, price arbitrage trends
    │       ├── CanonicalCatalogView.tsx # RxNorm / FDA master catalog table
    │       ├── StoreOperationsView.tsx  # Store dispense queue & buy-box desk
    │       ├── DisputeResolutionView.tsx# Escrow freeze & forensic adjudicator
    │       ├── ApiPartnersView.tsx      # EDI/FHIR R4 syndication & API keys
    │       └── ArchitectureView.tsx     # Interactive system architecture map
    └── data/
        └── mockData.ts         # High-fidelity mock stores, drugs, and orders
```

### Folder Placement Guidelines
1. **Never place patient-specific components in `src/components/enterprise/`** or vice versa.
2. Shared components used across both personas (e.g., modals, badges, universal headers) belong in `src/components/common/` or `src/components/`.
3. Do not create arbitrary root-level source directories without prior approval. All UI logic must be organized under `src/components/`.
4. Domain models and shared DTOs must be placed in `src/types.ts`. Do not scatter `.d.ts` files across component folders.

---

## 3. Naming Conventions

| Entity | Convention | Example |
| :--- | :--- | :--- |
| **Component Files** | PascalCase | `CompareView.tsx`, `PrescriptionUploadModal.tsx` |
| **Hook Files** | camelCase with `use` prefix | `useDrugArbitrage.ts`, `useOrderTracking.ts` |
| **Utility / Data Files** | camelCase | `mockData.ts`, `formatCurrency.ts` |
| **TypeScript Types / Interfaces** | PascalCase | `PharmacyStore`, `DrugOffer`, `Order` |
| **Component Props** | PascalCase with `Props` suffix | `ExploreViewProps`, `StoreOperationsProps` |
| **Event Handlers** | camelCase with `handle` prefix | `handleAddToCart`, `handleExecuteResolution` |
| **Callback Prop Names** | camelCase with `on` prefix | `onSelectDrug`, `onCloseModal`, `onUpdatePrice` |
| **Boolean Flags** | camelCase with `is`, `has`, or `can` prefix | `isVerifiedHub`, `hasDriveThru`, `canDispense` |
| **Constants & Enum Values** | UPPER_SNAKE_CASE | `DEFAULT_LATENCY_MS`, `MAX_REFILLS_ALLOWED` |
| **CSS / Tailwind Classes** | Standard Tailwind lowercase with hyphens | `bg-slate-900`, `rounded-2xl`, `p-4` |

---

## 4. UI/UX Consistency Rules

### 4.1 Aesthetic Identity & Color System
The application utilizes two distinct but harmonious visual themes tailored to the active persona:

- **Patient Theme (Trust, Health, Clarity)**:
  - Primary Accent: Medical Blue (`blue-600` / `blue-500`)
  - Verification / Savings Accent: Emerald (`emerald-600` / `emerald-500`)
  - Backgrounds: Crisp clean whites (`bg-white`) and soft slates (`bg-slate-50`)
  - Cards: High-contrast white containers with subtle borders (`border-slate-200`) and soft shadows (`shadow-xs`).
- **Enterprise Theme (Precision, Command Center, Data Density)**:
  - Header & Accent: Dark Navy / Slate (`bg-slate-900`, `text-slate-100`)
  - Metric Accents: Indigo (`indigo-600`), Violet (`violet-600`), Amber warnings (`amber-500`), and Ruby alerts (`rose-600`)
  - Layout: High-density tables, monospaced code blocks, and real-time status tickers.

### 4.2 Typography & Spacing
- Rely on modern sans-serif typography (`Inter`, system UI font stack).
- Monospaced fonts (`font-mono`) are mandatory for NDC codes, RxNorm IDs, RFID seal tags (`SEAL-8910-A`), and API payloads.
- Consistent border radius: Use `rounded-2xl` for primary containers/modals and `rounded-xl` for cards/buttons.

### 4.3 Responsive Design & Mobile Frame Support
- All patient screens must support both full desktop viewports and the simulated mobile device frame toggle (`isMobileFrame` state in `App.tsx`).
- Interactive elements must have a minimum touch target of $44 \times 44\text{px}$ on mobile layouts.
- Always include Lucide React icons beside key action buttons to improve scannability.

### 4.4 Micro-Animations
- Use subtle CSS transitions (`transition-all duration-200`) or Motion (`motion/react`) for:
  - Modal entries and backdrop blurs (`backdrop-blur-xs`)
  - Accordion / expandable drawer transitions
  - Cart counter badges and live price update pulses

---

## 5. Git Commit Rules

Follow the **Conventional Commits** specification (`<type>(<scope>): <short summary>`).

### 5.1 Commit Types
- `feat`: A new user-facing feature or capability.
- `fix`: A bug fix or correction of unexpected behavior.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `docs`: Documentation updates (e.g., `decisions.md`, `rules.md`, `memory.md`).
- `style`: Changes that do not affect the meaning of the code (formatting, white-space).
- `perf`: Code changes that improve performance or reduce bundle size.
- `test`: Adding or correcting tests.
- `chore`: Build process, package updates, or tooling configuration.

### 5.2 Commit Formatting Standards
```git
# Format:
<type>(<scope>): <imperative summary>

[optional body explaining why the change was made and background context]

[optional footer referencing issue numbers or breaking changes]

# Examples:
feat(patient): add FDA bioequivalence breakdown modal in compare view
fix(disputes): prevent double escrow refund execution on rapid click
docs(adr): document buy-box multi-factor scoring algorithm
refactor(types): unify PharmacyStore and DrugOffer interfaces
```

### 5.3 Branch Naming Rules
- `feature/<short-description>` (e.g., `feature/gemini-ocr-live`)
- `bugfix/<issue-description>` (e.g., `bugfix/cart-quantity-calc`)
- `hotfix/<critical-patch>` (e.g., `hotfix/rfid-verification-bypass`)

---

## 6. Security & Environment Variable Rules

### 6.1 HIPAA & Patient Health Information (PHI)
- **Zero PHI Exposure**: Never log unmasked patient names, phone numbers, delivery addresses, or doctor NPI numbers to the browser console or public error monitoring services.
- **Synthetic Data in Mocks**: All default data in `mockData.ts` must use fictitious names, simulated addresses, and synthetic NPI/Rx numbers.

### 6.2 Environment Variable Hygiene
- All environment variables must be declared in [`.env.example`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/.env.example) with clear comments.
- **Never commit `.env` or `.env.local` to git.** Verify `.gitignore` contains `.env` and `.env.*` (except `.env.example`).
- Recognized variables:
  - `GEMINI_API_KEY`: API key for Gemini multimodal vision/OCR calls.
  - `APP_URL`: Canonical deployment origin for webhooks and OAuth redirects.
- Access environment variables via `process.env.<VAR>` or `import.meta.env.<VAR>`. Never hardcode API keys or secret tokens directly in source code.

### 6.3 Payload Sanitization
- Validate external JSON inputs (e.g., FHIR payloads in `ApiPartnersView`) before processing.
- Prevent Cross-Site Scripting (XSS) by using React's default JSX string escaping. Never use `dangerouslySetInnerHTML` with unsanitized user inputs.

---

## 7. Operational Verification Checklist

Before presenting any code modification or marking a task complete, verify:

- [ ] **No regressions**: Did you check that existing components in both `patient` and `enterprise` views still render without errors?
- [ ] **TypeScript compiles**: Run `npm run lint` (`tsc --noEmit`) to verify zero type errors.
- [ ] **Console check**: Ensure no unhandled runtime exceptions or missing key warnings appear in the developer console.
- [ ] **Responsiveness**: Verify that the UI renders properly on desktop screens and inside the mobile container frame.
- [ ] **Documentation updated**: If an architectural decision or state contract changed, update `decisions.md`, `memory.md`, and `changelog.md`.
