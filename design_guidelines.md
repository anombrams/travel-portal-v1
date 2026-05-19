# Design Guidelines: seapark.id Marine Conservation Tourism Platform

## Design Approach
**Reference-Based Approach** drawing inspiration from:
- **Airbnb** (travel exploration, booking flow, destination microsites)
- **Instagram** (Sea-Log feed, community engagement)
- **Apple** (minimalist restraint, premium feel)
- **Conservation brands** (ocean-themed authenticity, purpose-driven design)

**Core Philosophy**: "Less Navigation, More Immersion" - Hide complexity behind clean, visual interfaces that prioritize emotional connection to ocean conservation.

---

## Typography System

**Font Families** (via Google Fonts):
- Primary: Inter (navigation, UI elements, body text)
- Display: Montserrat (hero headlines, section titles)

**Hierarchy**:
- Hero Headline: Montserrat Bold, text-5xl md:text-7xl
- Section Headers: Montserrat SemiBold, text-3xl md:text-5xl
- Subsections: Inter SemiBold, text-xl md:text-2xl
- Body: Inter Regular, text-base md:text-lg
- Captions/Meta: Inter Medium, text-sm
- Navigation: Inter Medium, text-base

---

## Layout & Spacing System

**Tailwind Spacing Primitives**: Use 4, 6, 8, 12, 16, 20, 24 units consistently
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-20 lg:py-24
- Card gaps: gap-6 md:gap-8
- Button padding: px-6 py-3

**Container Strategy**:
- Global max-width: max-w-7xl mx-auto
- Content sections: max-w-6xl
- Text-heavy areas: max-w-4xl
- Mobile gutters: px-4 md:px-6

---

## Navigation Structure

**Desktop Sticky Header** (transparent overlay on hero, solid white after scroll):
- Height: h-20
- Logo left, 4 text links centered, CTA button right
- Subtle backdrop blur when scrolling
- Links: text-base, 16px spacing between items

**Mobile Bottom Navigation Bar**:
- Fixed bottom position
- 4 icon buttons + 1 centered floating FAB
- Icons from Heroicons (outline style)
- Active state: filled icon variant
- Height: h-16 with safe-area-inset

**Floating Action Button** (Beli Tiket):
- Fixed position, bottom-8 right-8 on desktop
- Centered in mobile bottom nav
- Large circular button: w-14 h-14
- Pulsing subtle animation on idle

---

## Page-Specific Layouts

### 1. Landing Page

**Hero Section** (h-screen, max-h-[800px]):
- Full-screen background video (autoplay, loop, muted)
- Dark gradient overlay (bg-gradient-to-b from-black/40 to-black/60)
- Centered content with dramatic headline + search bar
- Headline: "Jelajahi Surga. Jaga Masa Depan." 
- Search bar: max-w-2xl, rounded-full, glass morphism effect (backdrop-blur-md bg-white/10)

**Live Ticker Strip** (immediately below hero):
- Full-width horizontal scrolling text
- Background: ocean gradient (teal to blue)
- Height: h-12
- Animating marquee effect

**Spotlight Section** (py-20):
- 3-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Image-first cards with overlay text
- Aspect ratio: aspect-[4/5]
- Hover: subtle scale and shadow increase

### 2. Jelajah (Explore) Page

**3D Interactive Globe**:
- Hero area: min-h-[600px]
- Globe centered, taking 70% viewport width
- 4 clickable location markers (pulsing pins)
- Side panel: location info cards (w-80, sliding from right)

**Location Microsites** (full-page takeovers):
- Hero image: h-[400px] with location name overlay
- Unique widget per location (centered, max-w-lg)
- Ticket CTA: sticky bottom bar on mobile
- Grid gallery: grid-cols-2 md:grid-cols-3 gap-4

### 3. Komunitas (Community Hub)

**Tab Navigation**:
- Horizontal tabs with underline indicator
- 3 tabs: Trip Buddy, Sea-Log, Academy
- Active tab: border-b-2 border-ocean-500

**Trip Buddy**: 
- Masonry grid cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Card: user avatar (top), destination badge, dates, budget tag
- Filter sidebar: sticky on desktop

**Sea-Log Feed**:
- Instagram-style: 1-column on mobile, 2-column on tablet, 3-column on desktop
- Square images (aspect-square)
- User info overlay at bottom
- Upload FAB: bottom-right corner

**Academy/Event**:
- Calendar view toggle (list/grid)
- Event cards: horizontal on mobile, 2-column grid on desktop

### 4. Dampak (Impact Dashboard)

**Dashboard Layout**:
- Hero stats bar: 4 metrics in grid-cols-2 md:grid-cols-4
- Large data visualization section: full-width chart area
- Two-column split: Chart left (60%), explanation right (40%)

**Coral Adoption Map**:
- Interactive map: h-[500px]
- Zoom controls, location markers
- Side drawer: adopted coral details

**Research Section**:
- Infographic cards: grid-cols-1 md:grid-cols-2 gap-8
- Icon + stat + description pattern

### 5. Profil (Sea-Passport)

**Profile Header**:
- Cover photo area: h-48 with avatar overlay (bottom-left)
- Level badge: floating top-right
- Stats row: 3-4 metrics (donations, corals, visits)

**Digital Passport Book**:
- Horizontal scroll carousel (snap-x snap-mandatory)
- Stamp cards: aspect-[3/4], passport-style design
- Swipe indicators (dots)

**Ticket Wallet**:
- Expandable accordion for each active ticket
- QR code: max-w-xs mx-auto
- Ticket details in list format

---

## Component Library

**Cards**:
- Rounded corners: rounded-xl (12px)
- Shadow: shadow-lg
- Padding: p-6
- Hover: transform scale-[1.02] transition-transform

**Buttons**:
- Primary CTA: Large rounded-full, px-8 py-4
- Secondary: Outlined variant with rounded-lg
- Icon buttons: Square w-10 h-10 or circular
- All buttons: backdrop-blur-sm when over images

**Form Inputs**:
- Rounded: rounded-lg
- Height: h-12
- Border: border-2 focus:border-ocean-500
- Padding: px-4

**Images**:
- All images: rounded corners (rounded-lg minimum)
- Hero images: object-cover with proper aspect ratios
- Lazy loading for performance
- Alt text for accessibility

---

## Images Specification

**Landing Page**:
- **Hero Background Video/Image**: Full-screen cinematic footage of underwater marine life (Raja Ampat/Banda coral reefs, schools of fish, rays). Fallback to high-quality still image.
- **Spotlight Cards**: 3 landscape images - Guardian portrait (human connection), user-submitted dive photo (community), event gathering (social proof)

**Jelajah Microsites**:
- Each location needs 4-6 gallery images showcasing biodiversity, underwater scenes, and conservation activities
- Hero image per location: dramatic wide shot of signature landscape

**Community Hub**:
- User-generated content placeholders in Sea-Log feed
- Profile avatars throughout Trip Buddy cards

**Impact Dashboard**:
- Before/after coral restoration photos
- Patrol boat images
- Research activity photos

**Sea-Passport**:
- Profile cover photo (user's favorite dive spot)
- Stamp illustrations per location (custom iconography)

---

## Animations (Minimal Application)

**Essential Only**:
- Hero video autoplay (silent, looping)
- Ticker scroll animation (continuous marquee)
- 3D globe rotation on user drag
- Tab transitions: slide effect
- Card hover: subtle lift (translateY(-4px))
- Button states: scale(0.98) on active
- Page transitions: fade-in content

**Avoid**: Excessive scroll-triggered animations, parallax effects, unnecessary micro-interactions

---

## Accessibility Standards

- Maintain 4.5:1 contrast ratio for all text
- Focus indicators on all interactive elements (ring-2 ring-ocean-500)
- Aria labels for icon-only buttons
- Skip navigation link
- Keyboard navigation support for globe interaction
- Alt text for all meaningful images
- Screen reader announcements for live ticker updates

---

## Mobile-First Considerations

- Touch targets: minimum 44x44px
- Bottom navigation for thumb-friendly access
- Swipeable carousels (passport stamps, galleries)
- Sticky CTAs for easy conversion
- Simplified navigation (hamburger not needed with bottom nav)
- Larger tap zones for map markers
- Pull-to-refresh on Sea-Log feed