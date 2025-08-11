# Situationship Graveyard - Complete Application Documentation

## Overview

Situationship Graveyard is a Next.js web application that allows users to memorialize their failed relationships, flings, and almost-relationships in a dark, humorous graveyard setting. The app provides a unique way to process and document dating experiences through an interactive graveyard interface with customizable tombstones.

## Core Concept

The app treats failed relationships as "deceased situationships" that are buried in a virtual graveyard. Each situationship gets its own tombstone with customizable colors, epitaphs, and detailed "autopsy" information about the relationship's demise.

## Technology Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **State Management**: React hooks and localStorage for persistence
- **Deployment**: Vercel-ready configuration

## User Experience (UX) Design

### Visual Theme
- **Dark Mode Only**: Consistent dark theme with zinc/gray color palette
- **Graveyard Aesthetic**: Dark backgrounds, tombstone-shaped cards, skull icons
- **Gothic Humor**: Playful but respectful approach to relationship documentation
- **Responsive Design**: Mobile-first with bottom navigation for easy thumb access

### Navigation Flow
1. **Graveyard** (Home): View all buried situationships in card format
2. **Add**: Create new situationship memorials
3. **Detail View**: Individual situationship pages with full autopsy
4. **Edit**: Modify existing situationships
5. **Stats**: Analytics and insights about dating history

### Interaction Patterns
- **Swipe Gestures**: Cards support touch interactions
- **Toast Notifications**: 4-second duration feedback for actions
- **Color Customization**: Real-time preview of grave colors
- **Revive/Bury**: Toggle situationship status with visual effects

## Page-by-Page Breakdown

### 1. Graveyard Page (`/app/graveyard/page.tsx`)

**Purpose**: Main dashboard showing all buried situationships

**Layout**:
- Header with "Situationship Graveyard" title and skull icon
- Grid of tombstone cards (2 columns on mobile, 3+ on desktop)
- Bottom navigation bar

**Grave Card Features**:
- **Tombstone Shape**: Rounded top with border styling
- **Color Themes**: 8 different color options with textures
- **Content Display**: Name, dates, epitaph, cause of death
- **Interactive Elements**: Revive/Bury buttons, dropdown menu
- **Visual Effects**: Glow effects for revived graves, texture overlays

**Card Information Display**:
- Situationship name (prominent)
- Date range (start - end)
- Epitaph (truncated to 100 characters)
- Cause of death with emoji
- Photo (if uploaded) or skull icon
- Revival status indicator

**Actions Available**:
- **Revive**: Changes status to "alive" with amber glow
- **Bury**: Returns to "deceased" status
- **View**: Navigate to detail page
- **Edit**: Modify situationship data
- **Delete**: Remove from graveyard (placeholder)

### 2. Add Page (`/app/add/page.tsx`)

**Purpose**: Create new situationship memorials

**Form Sections**:

**Basic Information**:
- Name input (required, text field)
- Start date picker (date input)
- End date picker (date input)
- Cause of death selection (dropdown with predefined options)
- Epitaph text area (multiline, 500 character limit)

**Cause of Death Options**:
- "Ghosted" (👻)
- "Breadcrumbed" (🍞)
- "Slow Fade" (🌅)
- "Love Bombed" (💣)
- "Never Started" (❓)
- "Friend Zoned" (👥)
- "Cheated On" (💔)
- "Different Goals" (🎯)
- "Long Distance" (✈️)
- "Timing Issues" (⏰)

**Photo Upload** (Optional):
- Drag-and-drop interface
- Skull icon placeholder
- Upload button with arrow icon
- File type: Images only (JPG, PNG, WebP)
- Max file size: 5MB
- Preview before upload

**Grave Color Selection**:
- Grid of 8 color options
- Real-time preview with textures
- Stone texture for classic gray
- Circle pattern for pink
- Standard gradients for other colors

**Emotional Autopsy**:
- Meet in person toggle (boolean)
- Kissed toggle (boolean)
- Hooked up toggle (boolean)
- Fell in love toggle (boolean)
- Had fights toggle (boolean)
- Were exclusive toggle (boolean)
- Talked for weeks (number input, 0-999)

**Form Validation**:
- Required fields validation (name, dates, cause)
- Date range validation (end date must be after start date)
- Character limits on epitaph (500 max)
- Number validation for weeks (positive integers)
- Toast notifications for errors

### 3. Situationship Detail Page (`/app/situationship/[id]/page.tsx`)

**Purpose**: Comprehensive view of individual situationship

**Layout Sections**:

**Header**:
- Back navigation (arrow icon)
- Situationship name as title
- Profile icon (user avatar)

**Status Badges**:
- Cause of death badge (red background)
- Revival status badge (amber with lightning icon)

**Memorial Section**:
- Small tombstone visualization (mini version of grave card)
- Epitaph display (full text, not truncated)
- Duration information (calculated from dates)
- Color customization interface

**Color Picker**:
- Grid of color options (same as add/edit pages)
- Stone texture for classic gray
- Circle pattern for pink
- Real-time preview
- Toast notification on change (4 seconds)

**Emotional Autopsy**:
- Detailed relationship metrics in grid layout
- Yes/no questions with toggle switches
- Duration display (formatted as "X months/days")
- Location information (text field)
- Red flags list (array of strings)
- Last message display (text field)

**Actions**:
- Revive/Bury buttons (toggle functionality)
- Customize color button (opens color picker)
- Navigation to edit page

### 4. Edit Page (`/app/edit/[id]/page.tsx`)

**Purpose**: Modify existing situationship data

**Form Structure**:
- Pre-populated with existing data on page load
- Same sections as Add page
- Photo upload/replacement (can change existing photo)
- Color selection with previews
- All autopsy fields editable

**Differences from Add**:
- Loads existing data on mount (useEffect with ID)
- Updates instead of creates (PUT vs POST logic)
- Maintains original creation date (read-only)
- Preserves ID and metadata
- Form submission updates existing record

### 5. Stats Page (`/app/stats/page.tsx`)

**Purpose**: Analytics and insights about dating history

**Metrics Displayed**:
- Total situationships count (number)
- Average relationship duration (calculated from all dates)
- Most common cause of death (frequency analysis)
- Revival rate percentage (revived vs total)
- Color preference breakdown (count by color)
- Emotional autopsy statistics (percentage breakdowns)

**Visual Elements**:
- Progress bars for percentages
- Charts for data visualization
- Color-coded statistics
- Summary cards with metrics

## Color System & Visual Design

### Grave Color Themes

**1. Classic Grey** (`#27272a`):
- Stone texture overlay with circles
- Multiple shades of gray for depth
- Default color for new graves
- Subtle gradient with white overlay

**2. Rose Wine** (`#7f1d1d`):
- Dark red/maroon
- Standard gradient styling
- Border color: `#b91c1c`

**3. Ocean Depths** (`#1e3a8a`):
- Deep blue
- Border color: `#1d4ed8`

**4. Forest Night** (`#14532d`):
- Dark green
- Border color: `#15803d`

**5. Sunset Glow** (`#7c2d12`):
- Dark orange/brown
- Border color: `#c2410c`

**6. Royal Purple** (`#581c87`):
- Deep purple
- Border color: `#7c3aed`

**7. Pink Blossom** (`#db2777`):
- Bright pink with white/blue circle pattern
- Unique texture overlay
- White and deepskyblue circles
- Border color: `#be185d`

**8. Midnight Black** (`#18181b`):
- Pure black
- Border color: `#27272a`

### Texture Implementation

**Stone Texture (Classic Grey)**:
- SVG pattern with multiple circles
- Different opacities (0.4-0.8)
- Various circle sizes (0.5-2.0 radius)
- Shades: `#3a3a3a`, `#454545`, `#333333`
- Creates realistic stone appearance

**Pink Pattern**:
- White circles with high opacity
- Deepskyblue accent circles
- Playful, bubble-like appearance
- Unique among color options

### Visual Effects

**Revival Effects**:
- Amber glow around tombstone
- Multiple shadow layers
- Inset glow for depth
- Lightning icon indicator

**Gradient Overlays**:
- Standard: `linear-gradient(to bottom right, baseColor, rgba(255,255,255,0.15))`
- Pink: `linear-gradient(to bottom right, #db2777, rgba(255,255,255,0.65))`
- Stone: `linear-gradient(to bottom right, baseColor, rgba(255,255,255,0.15))`

## Data Structure & State Management

### Situationship Interface

```typescript
interface Situationship {
  id: string;
  name: string;
  cause: string;
  dates: { start: string; end: string };
  epitaph: string;
  photo?: string;
  details: {
    meetInPerson: boolean;
    dateCount: number;
    kissed: boolean;
    hookup: boolean;
    exclusive: boolean;
    duration: string;
    location: string;
    redFlags: string[];
    lastMessage: string;
  };
  revived: boolean;
  createdAt: string;
}
```

### Local Storage Keys

- `grave-color-${id}`: Color preference per situationship
- `situationships`: Array of all situationships
- Form data persistence across sessions

### State Management

**React Hooks**:
- `useState` for form data and UI state
- `useEffect` for data loading and persistence
- `useToast` for notifications
- Custom hooks for mobile detection

**Data Flow**:
1. Load from localStorage on mount
2. Update state on form changes
3. Save to localStorage on submit
4. Toast notifications for feedback

## Component Architecture

### Core Components

**GraveCard** (`components/grave-card.tsx`):
- Main tombstone display component
- Handles revive/bury functionality
- Responsive design with mobile optimization
- Dropdown menu for actions
- Photo display with fallback

**AppHeader** (`components/app-header.tsx`):
- Consistent header across pages
- Back navigation support
- Title display
- Profile icon

**BottomNav** (`components/bottom-nav.tsx`):
- Mobile-first navigation
- Three main sections
- Active state indicators
- Icon-based design

**ThemeProvider** (`components/theme-provider.tsx`):
- Dark theme enforcement
- System theme disabled
- Consistent styling

### UI Components (shadcn/ui)

**Form Elements**:
- Input, Textarea, Select
- Switch for toggles
- Button variants
- Card layouts

**Navigation**:
- DropdownMenu for actions
- Dialog for confirmations
- Toast notifications

**Layout**:
- Grid systems
- Responsive containers
- Spacing utilities

## Toast Notification System

### Implementation Details

**Duration**: 4 seconds (4000ms)
**Limit**: 1 toast at a time
**Animation**: Slide in from top, fade out
**Actions**: Dismissible with X button

**Toast Types**:
- Success: Color changes, revive/bury actions
- Error: Form validation, upload failures
- Info: Feature announcements

**Technical Implementation**:
- Custom `useToast` hook
- Radix UI toast primitives
- Timeout management with cleanup
- Memory leak prevention

## Mobile Experience

### Responsive Design

**Breakpoints**:
- Mobile: < 768px (primary focus)
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Optimizations**:
- Bottom navigation for thumb access
- Large touch targets (44px minimum)
- Swipe gestures on cards
- Simplified layouts on small screens

**Touch Interactions**:
- Card swipes for quick actions
- Long press for context menus
- Tap targets properly sized
- Hover states disabled on touch

## Performance Considerations

### Optimization Strategies

**Code Splitting**:
- Page-based lazy loading
- Component-level splitting
- Dynamic imports for heavy components

**Image Optimization**:
- Next.js Image component
- WebP format support
- Responsive image sizing
- Lazy loading for photos

**State Management**:
- Minimal re-renders
- Efficient localStorage usage
- Debounced form updates
- Optimized toast system

## Error Handling

### User-Facing Errors

**Form Validation**:
- Required field indicators
- Date range validation
- Character limit enforcement
- Real-time feedback

**Network Errors**:
- Graceful fallbacks
- Retry mechanisms
- User-friendly messages

**Data Corruption**:
- localStorage validation
- Default value fallbacks
- Data recovery options

## Accessibility Features

### WCAG Compliance

**Keyboard Navigation**:
- Tab order optimization
- Focus indicators
- Skip links

**Screen Reader Support**:
- Semantic HTML structure
- ARIA labels
- Alt text for images
- Status announcements

**Color Contrast**:
- WCAG AA compliance
- High contrast ratios
- Color-independent indicators

## Future Enhancement Possibilities

### Potential Features

**Social Features**:
- Share situationships
- Anonymous dating insights
- Community statistics

**Advanced Analytics**:
- Relationship patterns
- Personal growth tracking
- Dating advice based on history

**Customization**:
- Custom grave shapes
- Personal epitaph templates
- Photo filters and effects

**Data Export**:
- PDF memorials
- Relationship timelines
- Data backup/restore

## Technical Implementation Notes

### Build Configuration

**Next.js Config**:
- App Router enabled
- TypeScript strict mode
- Tailwind CSS integration
- Image optimization

**Deployment**:
- Vercel-ready configuration
- Environment variables
- Build optimization
- Performance monitoring

### Development Workflow

**Code Organization**:
- Feature-based file structure
- Component reusability
- Consistent naming conventions
- Type safety throughout

**Testing Strategy**:
- Component testing
- Integration testing
- User flow validation
- Performance testing

## Additional Technical Details

### Photo Upload Implementation
- Uses HTML5 File API
- Client-side image processing
- Base64 encoding for storage
- File size validation (5MB limit)
- Image format validation (JPG, PNG, WebP)

### Date Handling
- Uses native HTML date inputs
- Date validation (end must be after start)
- Duration calculation in months/days
- ISO string format for storage

### Color Persistence
- Individual color preferences per situationship
- localStorage key format: `grave-color-${situationshipId}`
- Fallback to classic gray if no preference stored
- Real-time preview updates

### Form State Management
- Controlled components for all inputs
- Real-time validation feedback
- Debounced updates to prevent excessive re-renders
- Form reset functionality on successful submission

### Toast System Technical Details
- Custom reducer pattern for state management
- Timeout cleanup to prevent memory leaks
- Unique ID generation for each toast
- Automatic dismissal after 4 seconds
- Manual dismissal via close button

This documentation provides a comprehensive overview of the Situationship Graveyard application, covering all aspects from user experience to technical implementation. The app successfully combines humor, functionality, and emotional processing in a unique digital memorial format.
