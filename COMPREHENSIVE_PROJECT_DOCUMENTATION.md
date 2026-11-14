# Situationship Graveyard - Comprehensive Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Core Concept & Philosophy](#core-concept--philosophy)
3. [Technology Stack](#technology-stack)
4. [Application Architecture](#application-architecture)
5. [Page-by-Page Analysis](#page-by-page-analysis)
6. [Component Architecture](#component-architecture)
7. [Data Structure & State Management](#data-structure--state-management)
8. [Visual Design System](#visual-design-system)
9. [User Experience & Interaction Patterns](#user-experience--interaction-patterns)
10. [Privacy & Data Handling](#privacy--data-handling)
11. [Error Handling](#error-handling)
12. [Technical Implementation Details](#technical-implementation-details)
13. [Mobile & App Store Packaging](#mobile--app-store-packaging)
14. [Deployment & Configuration](#deployment--configuration)
15. [Development Workflow](#development-workflow)
16. [Future Enhancement Possibilities](#future-enhancement-possibilities)
17. [Marketing & Positioning Notes](#marketing--positioning-notes)

---

## Project Overview

**Situationship Graveyard** is a Next.js 15 web + iOS (Capacitor) application that provides a dark-humored way to process and document failed relationships, flings, and almost-relationships. Users memorialise these experiences as “deceased situationships” in a virtual graveyard with customisable tombstones, emotional “autopsies,” stats, and a relationship timeline.

The product is being prepared for **Apple App Store** distribution as a native iOS shell around a static Next.js export. There is **no backend**. All user data stays on-device in `localStorage`.

### Key Facts
- **Product name (user-facing)**: Situationship Graveyard
- **iOS display name** (`Info.plist`): Situationship Graveyard
- **Capacitor `appName` / bundle**: `Gravely` / `com.troid.gravely` (internal packaging identifiers; not the primary marketing name)
- **Framework**: Next.js 15.2.4 (App Router) with `output: 'export'` for static hosting / Capacitor
- **Language**: TypeScript
- **Styling**: Tailwind CSS with a custom dark theme
- **UI kit**: shadcn/ui on Radix UI (~21 components in `components/ui`)
- **State**: React hooks + `localStorage`
- **Mobile**: Capacitor 7 (iOS), `@capacitor/status-bar`, Expo present in dependencies
- **Version**: 1.0.0
- **Support email**: toxicos@gmail.com

### Live / Source
- **GitHub**: https://github.com/mike-star01/Toxic
- **Web demo**: https://toxic-neon.vercel.app

---

## Core Concept & Philosophy

### The Graveyard Metaphor
- **Situationships as graves**: Each failed or unfinished relationship becomes a grave with a tombstone
- **Memorialisation**: Epitaphs, photos, cause of death, and autopsy details
- **Revive / bury**: Relationships can be marked revived (rekindled) or buried again
- **Personalisation**: 8 tombstone colour themes (classic + textured variants)
- **Emotional processing**: Forms and stats encourage reflection without a clinical tone

### Psychological Framing (for product / marketing)
- Catharsis through humour instead of shame
- Pattern recognition via Stats and Timeline
- Closure through a formal “burial” ritual
- Private journaling — no accounts, no social feed, no server sync

---

## Technology Stack

### Core
- **Next.js 15.2.4** — App Router, static export
- **React 19**
- **TypeScript 5**

### Styling & UI
- **Tailwind CSS 3.4.17**
- **Radix UI** + **shadcn/ui**
- **Lucide React** icons
- Custom CSS / CSS Modules (e.g. revival glow, animated rose, add-page candles)

### Forms & Validation Libraries Present
- **React Hook Form**, **Zod**, `@hookform/resolvers` are installed
- Primary add/edit flows use controlled React state + toast validation (not a single shared Zod schema across the app)

### Mobile
- **Capacitor Core / CLI / iOS** `^7.4.4`
- **@capacitor/status-bar** for native status bar behaviour
- Scripts: `build:mobile`, `sync:ios`, `open:ios`

### Data
- **Client-only** — `localStorage` keys such as `situationships` and `grave-color-${id}`
- No auth, no API routes, no analytics SDK

### Tooling Notes
- ESLint and TypeScript errors are **ignored during builds** (`next.config.mjs`) for shipping flexibility
- Images are **unoptimized** (`images.unoptimized: true`) because of static export constraints

---

## Application Architecture

### File Structure (accurate)
```
Toxic/
├── app/
│   ├── add/                      # Create situationship
│   ├── edit/                     # Edit via ?id= query param
│   ├── graveyard/                # Main grave grid (+ loading.tsx)
│   ├── situationship/            # Detail via ?id= query param
│   ├── stats/                    # Analytics
│   ├── timeline/                 # Gantt-style relationship timeline
│   ├── privacy/                  # In-app privacy policy
│   ├── profile/
│   │   ├── page.tsx              # Profile / settings
│   │   └── reorder/              # Drag-and-drop grave order
│   ├── layout.tsx                # Root layout, BottomNav, Toaster, StatusBar
│   ├── page.tsx                  # Redirects to /graveyard
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn primitives
│   ├── app-header.tsx
│   ├── bottom-nav.tsx
│   ├── grave-card.tsx
│   ├── lazy-grave-card.tsx       # IntersectionObserver lazy mount
│   ├── animated-rose.tsx (+ CSS module)
│   ├── status-bar-init.tsx       # Capacitor StatusBar
│   └── theme-provider.tsx
├── hooks/
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── ios/                          # Capacitor iOS native project
├── capacitor.config.ts
├── next.config.mjs               # output: 'export'
├── vercel.json
└── package.json
```

### Routing (important correction)
Dynamic folder segments like `/edit/[id]` are **not** used. IDs are passed as **query parameters**:

| Page | Path |
|------|------|
| Home | `/` → redirects to `/graveyard` |
| Graveyard | `/graveyard` |
| Add | `/add` |
| Edit | `/edit?id={id}` |
| Detail | `/situationship?id={id}` |
| Stats | `/stats` |
| Timeline | `/timeline` |
| Profile | `/profile` |
| Reorder | `/profile/reorder` |
| Privacy | `/privacy` |

> Note: `/timeline` is implemented. As of this writing it is not wired into the bottom nav; entry may be via direct URL or future nav link.

### Component Hierarchy
```
RootLayout
├── StatusBarInit (Capacitor)
├── ThemeProvider (dark)
├── Page content (pb-16 for bottom nav clearance)
├── BottomNav (Graveyard / Add / Stats)
└── Toaster
```

Profile is reached from the header (not the bottom nav).

---

## Page-by-Page Analysis

### 1. Home (`/app/page.tsx`)
- Client redirect with `router.replace("/graveyard")`
- No visible UI

### 2. Graveyard (`/app/graveyard/page.tsx`)
**Main dashboard** for all graves.

**Features**:
- Search by name
- Optional cause-of-death filter panel
- Responsive grid of tombstones via `LazyGraveCard`
- Loads / syncs from `localStorage`
- Listens for `situationshipUpdated` custom events (e.g. flower / revive updates)
- Empty and filtered empty states
- Atmospheric extras (e.g. fireflies toggle/state in page)

**Actions on cards** (via `GraveCard`): view, edit, delete, revive/bury, add/remove flowers

### 3. Add (`/app/add/page.tsx`)
**Create a new memorial.**

**Header**: “Add a Grave” with back navigation

**Form areas**:
1. **Basics** — name (required), start/end dates (required), cause of death, epitaph
2. **Precise duration** — when start/end share the same month, optional days/weeks precision
3. **Photo** — file picker, image validation, Base64 into `localStorage` (size limit ~5MB)
4. **Grave colour** — 8 themes with live preview
5. **Emotional autopsy** — toggles for met in person, kissed, hookup, love, fights, exclusive, closure; date count (number or “?”); emotional impact scale; reflection text; red flags / flags lists
6. **Flowers** — initial flower count supported

**Causes of death (current options)**:
| Key | Label | Emoji |
|-----|-------|-------|
| ghosted | Ghosted | 👻 |
| breadcrumbed | Breadcrumbed | 🍞 |
| fumbled | Fumbled | 🏀 |
| friendzoned | Friendzoned | 🤝 |
| incompatible | Incompatible | 🧩 |
| slow fade | Slow Fade | 🌅 |
| cheated | Cheated | 💔 |
| other | Other | 💀 |

Stored `cause` values are **display labels** (e.g. `"Ghosted"`), not always the slug keys.

**Validation**: required name/cause/dates via toasts; end after start; epitaph length constraints as implemented in UI.

`location` and `lastMessage` fields exist on the data model and are currently saved as empty strings from Add (legacy / reserved).

### 4. Edit (`/app/edit/page.tsx`)
- Same general form model as Add
- Loads target grave with `useSearchParams().get("id")`
- Updates the existing record (keeps id / original identity)
- Graceful handling when id is missing

### 5. Detail (`/app/situationship/page.tsx`)
- Loads by `?id=`
- Status badges, memorial summary, epitaph, duration
- Colour customisation with persistence to `grave-color-${id}`
- Autopsy metrics display
- Revive/bury and navigate to edit

### 6. Stats (`/app/stats/page.tsx`)
**Insights from local data**:
- Totals, revived count, average duration
- Cause breakdown with emoji normalisation (handles label variants)
- Monthly begin/end patterns
- Emotional / closure style percentages
- Progress bars and grid layouts

### 7. Timeline (`/app/timeline/page.tsx`)
**Gantt-style visualisation**:
- Bars for each situationship over time
- Lane packing for overlapping relationships
- Colours match grave themes when available
- Tap/click navigates to `/situationship?id=...`
- Parses both `YYYY-MM` and `"Month YYYY"` date formats

### 8. Profile (`/app/profile/page.tsx`)
- Persona header (“Heartbreak Collector”) with graves / revived / avg months
- **Settings**: Notifications (coming soon), Theme Preferences (coming soon), Reorder Graves (live)
- **Support**: Contact Support (`mailto:toxicos@gmail.com`), Privacy Policy link, Rate the App (coming soon)
- **Danger zone**: Delete All Data (`localStorage.clear()` + reload)
- Version label 1.0.0

### 9. Reorder (`/app/profile/reorder/page.tsx`)
- Custom drag-and-drop (no DnD library)
- Touch + mouse support
- Optional haptic vibration via `navigator.vibrate`
- Persists `order` on situationship records

### 10. Privacy (`/app/privacy/page.tsx`)
In-app privacy policy for App Store review and user trust:
- Local-only storage
- No tracking / analytics / ads / third-party data sharing
- User can delete individual graves or all data
- Children’s privacy section and contact path via support email

---

## Component Architecture

### `GraveCard` (`components/grave-card.tsx`)
- 8 colour themes; classic + pink have special textures
- Amber revival glow animation
- Photo or skull fallback
- Dropdown: view, edit, delete, flowers
- Randomised humorous toasts on revive/bury
- Haptic vibration where supported
- Animated rose bouquet when `flowers > 0`

### `LazyGraveCard` (`components/lazy-grave-card.tsx`)
- Mounts `GraveCard` when near viewport (`IntersectionObserver`) for list performance

### `AnimatedRose` (`components/animated-rose.tsx`)
- CSS Module petal/stem animation
- Scaled for card corner placement
- iOS Safari-oriented rendering tweaks

### `AppHeader` (`components/app-header.tsx`)
- Sticky, blurred header
- Variants with back button / profile affordance

### `BottomNav` (`components/bottom-nav.tsx`)
- Fixed tabs: **Graveyard**, **Add** (red CTA), **Stats**
- Safe-area padding for notched iPhones (`env(safe-area-inset-bottom)`)

### `StatusBarInit`
- On Capacitor: `StatusBar.setOverlaysWebView({ overlay: false })`

### UI library
Present under `components/ui`: button, input, textarea, select, checkbox, radio-group, switch, slider, card, badge, dialog, sheet, dropdown-menu, toast/toaster, progress, separator, skeleton, calendar, label, form.

---

## Data Structure & State Management

### Situationship shape (canonical / as used in Add)
```typescript
interface Situationship {
  id: string
  name: string
  cause: string                    // Display label, e.g. "Ghosted"
  dates: { start: string; end: string }  // Typically YYYY-MM
  epitaph: string
  reflection?: string
  photo?: string                   // Base64 data URL
  flowers?: number
  details: {
    meetInPerson: boolean
    dateCount: number | null       // null when user chose "?"
    kissed: boolean
    hookup: boolean
    love: boolean
    fight: boolean
    exclusive: boolean
    closure: boolean
    emotionalImpact: number        // ~1–10
    duration: string               // Human-readable, may be compound
    preciseDuration?: string       // e.g. "3 weeks" for same-month cases
    location: string               // Currently often ""
    redFlags: string[]
    lastMessage: string            // Currently often ""
    flags?: string[]
  }
  revived: boolean
  createdAt: string
  order?: number
}
```

Interfaces are **duplicated per page** (not yet a shared `types` module). Some older sample/fallback objects in detail/edit still show legacy demo data when an id is missing.

### Storage keys
- `situationships` — JSON array of all graves
- `grave-color-${id}` — colour theme key per grave

### Events
- `storage` — cross-tab sync where applicable
- `situationshipUpdated` — in-app updates (flowers / revive) without full reload

### Hooks
- `useToast` — primary custom hook
- There is **no** `useMobile` hook in the repo currently

---

## Visual Design System

### Palette
- Background: near-black / zinc-900–950
- Surfaces: zinc-800/900
- Text: zinc-50 / zinc-100
- Accent: red-600/800 (Add CTA, destructive actions)
- Revival accent: amber glow

### Grave colours
classic, rose, ocean, forest, sunset, purple, pink, black — hex themes defined in `grave-card.tsx` / add form.

### Typography
- **Inter** via `next/font/google` in `app/layout.tsx`

### Motion
- Revival `pulseGlow` / `outerPulse` keyframes
- Animated rose bouquet
- Add-page candle flame decorations
- Toast feedback (~4s)

---

## User Experience & Interaction Patterns

### Mobile-first (App Store primary surface)
- Bottom navigation with large touch targets
- Safe-area insets for home indicator
- Portrait-first; iOS project also declares landscape orientations in `Info.plist`
- Haptics on revive/bury/flowers/reorder where `navigator.vibrate` exists

### Actual interaction patterns
- Tap cards / menus (dropdown), not documented swipe actions
- Confirm dialogs for destructive clears / deletes
- Toast feedback with randomised copy for revive/bury
- Progressive disclosure for graveyard filters

### Accessibility (honest status)
Semantic HTML and Radix primitives help. Claims of full WCAG AA compliance should **not** be treated as verified audit results until tested.

---

## Privacy & Data Handling

Critical for App Store review and marketing trust:

| Topic | Behaviour |
|-------|-----------|
| Accounts | None |
| Backend | None |
| Analytics | None integrated |
| Ads | None |
| Data location | On-device `localStorage` only |
| Photos | Stored as Base64 locally with the grave |
| Delete | Per-grave delete + Profile “Delete All Data” |
| Policy | In-app at `/privacy` |

**App Store implication**: Privacy Nutrition Labels should reflect no data collection / data not linked to user, aligned with the in-app policy. Keep policy URL / in-app page current before submission.

---

## Error Handling

- Form validation via toasts (required fields, dates, file size/type)
- Missing `id` on edit/detail: fallbacks / empty handling (some pages still contain demo seed objects for missing ids — worth cleaning before store launch)
- Offline-first by design (no network dependency for core journaling)
- Capacitor plugins fail gracefully in browser (StatusBar try/catch)

---

## Technical Implementation Details

### Static export for Capacitor
`next.config.mjs` sets `output: 'export'`, producing a static site Capacitor loads from `webDir: 'out'`.

### Photo upload
FileReader → Data URL → stored on the situationship object in `localStorage`. Large photo sets can grow storage usage; worth monitoring for App Store QA devices.

### Colour persistence
`localStorage.setItem(`grave-color-${id}`, themeKey)` with classic fallback.

### Toast copy (randomised)
**Revive examples**: “They're back from the dead”, “You up? They are now”, “Plot twist: not dead”, etc.  
**Bury examples**: “Bye forever”, “Closed casket, closed DMs”, “Off the roster”, etc.

### Duration parsing
Stats/profile parse human strings including compound forms like `"2 months 3 weeks"` and year/month/week/day units.

---

## Mobile & App Store Packaging

### Capacitor config (`capacitor.config.ts`)
```ts
{
  appId: 'com.troid.gravely',
  appName: 'Gravely',
  webDir: 'out',
  server: { androidScheme: 'https' }
}
```

### iOS project
- Native project under `ios/`
- Display name: **Situationship Graveyard**
- Scripts:
  - `npm run build:mobile` → `next build && npx cap sync ios`
  - `npm run sync:ios`
  - `npm run open:ios`

### App Store readiness checklist (product docs)
- [ ] Align marketing name everywhere (store listing vs Capacitor `appName` vs website)
- [ ] Final App Icon / splash assets in `ios/App/App/Assets.xcassets`
- [ ] Privacy Policy reachable in-app (done: `/privacy`) and hosted URL for App Store Connect
- [ ] Age rating / content questionnaire (dating + dark humour; no UGC network)
- [ ] Test on physical devices (safe areas, status bar, localStorage persistence, photo size limits)
- [ ] “Rate the App” should deep-link to App Store review URL when live
- [ ] Confirm landscape support intentional or lock to portrait for v1
- [ ] Remove or gate any demo/fallback fake situationship data before review
- [ ] Decide Android timeline (Capacitor Android scheme already foreshadowed; not the current packaging focus)

### Positioning for store listing
- Category fit: Lifestyle / Health & Fitness / Entertainment (humour + reflection)
- Differentiator: private graveyard metaphor, not another dating app
- Privacy headline: “Your heartbreak stays on your phone”

---

## Deployment & Configuration

### Web (Vercel)
`vercel.json` targets Next.js with region `iad1`. Live demo: https://toxic-neon.vercel.app

### Next config highlights
```js
{
  output: 'export',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
}
```

### Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Local Next dev server |
| `npm run build` | Production / static export build |
| `npm start` | Next start (web) |
| `npm run deploy` | Helper via `deploy.js` |
| `npm run build:mobile` | Export + Capacitor iOS sync |
| `npm run open:ios` | Open Xcode workspace |

### Environment variables
None required for core app behaviour.

---

## Development Workflow

- Feature pages under `app/`, shared UI under `components/`
- Manual QA focus: iOS Safari + Capacitor WebView, Chrome desktop
- No automated test suite currently
- GitHub → Vercel for web; Xcode Archive → App Store Connect for iOS

---

## Future Enhancement Possibilities

*(Items already shipped are removed from “future”.)*

### Near-term (store polish)
- Wire Timeline into navigation (Stats or Profile)
- Shared TypeScript types module
- App Store rating prompt / link
- Portrait lock if landscape is unused
- Export / backup (JSON or PDF memorial) without cloud accounts
- Hardening storage quotas for many Base64 photos

### Product
- Optional iCloud / encrypted backup (opt-in only — keep privacy story intact)
- Epitaph templates
- Deeper pattern insights / “red flag report”
- Widgets or shareable tombstone images (privacy-preserving)

### Platform
- Android Capacitor build
- PWA install path for web users
- Push reminders only if clearly valuable and privacy-safe (currently Notifications = coming soon)

---

## Marketing & Positioning Notes

Use this section when briefing another chatbot or marketer.

### One-liner
A private, darkly funny graveyard for situationships — bury the almosts, track the patterns, keep the receipts on your phone.

### Audience
- Gen Z / millennials who date via apps
- People processing ghosting, breadcrumbing, slow fades
- Users who want journaling without therapy-app seriousness or public oversharing

### Tone
- Dark humour, gothic-cute, emotionally literate
- Never cruel toward the user; punch up at situationship culture
- Private by default — privacy is a feature, not a footnote

### Channels that fit
- TikTok / Reels tombstone aesthetic demos
- App Store screenshots: Graveyard grid, Add autopsy, Stats patterns, Privacy promise
- Influencer “bury him” meme formats
- Avoid positioning as a dating marketplace competitor

### Do not claim
- Clinical mental-health treatment
- Cloud sync / social network (unless built)
- Verified WCAG certification without an audit
- Backend AI features that do not exist yet

### Strengths to emphasise
- Unique metaphor
- Fully private / local-first
- Beautiful dark UI + playful revival/flower rituals
- Stats + timeline for pattern recognition
- Coming to the App Store as a focused iOS experience

---

## Conclusion

Situationship Graveyard is a **local-first, mobile-bound** journaling product wrapped in a graveyard metaphor. Technically it is a static Next.js 15 app packaged with Capacitor for iOS. Product-wise it combines humour, memorialisation, and light analytics to help users process unfinished relationships without giving their data to a server.

### Current strengths
- Distinct concept and voice
- Solid mobile-first UX with native packaging path
- Privacy story aligned with App Store expectations for on-device apps
- Feature set beyond a simple list: colours, flowers, revive, stats, timeline, reorder

### Known doc/code hygiene for launch
- Unify branding identifiers (`Gravely` vs Situationship Graveyard) in store materials
- Link Timeline in UI
- Clear demo fallbacks before review
- Finish “coming soon” profile actions or hide them for v1

---

*Source of truth for behaviour is the repository. Cross-check this file after large feature changes. GitHub: https://github.com/mike-star01/Toxic*
