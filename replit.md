# seapark.id - Marine Conservation Tourism Platform

## Overview
A mobile-first marine conservation tourism platform for Indonesia. The platform enables users to explore and book tickets to 8 marine conservation areas (Raja Ampat, Banda, Sawu, Gili Matra, Wakatobi, Komodo, Bunaken, Derawan), connect with fellow travelers, track conservation impact, and manage their digital sea-passport.

## Current State
Frontend prototype complete with all core pages and components.
Backend API complete with PostgreSQL database (persistent storage).
Authentication via email/password with bcryptjs hashing and session-based auth.

## Project Architecture

### Frontend Structure
```
client/src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Sticky navigation with theme toggle
│   │   └── MobileNav.tsx        # Bottom navigation for mobile
│   ├── features/
│   │   ├── HeroSection.tsx      # Landing page hero with search
│   │   ├── LiveTicker.tsx       # Animated PNBP transparency ticker
│   │   ├── SpotlightCard.tsx    # Featured content cards
│   │   ├── LocationCard.tsx     # Destination booking cards
│   │   ├── InteractiveMap.tsx   # Location selection map
│   │   ├── TripBuddyCard.tsx    # Travel companion matching
│   │   ├── SeaLogPost.tsx       # Instagram-style community posts
│   │   ├── EventCard.tsx        # Event/webinar cards
│   │   ├── ImpactStats.tsx      # Conservation metrics dashboard
│   │   ├── CoralMap.tsx         # Coral adoption tracking map
│   │   ├── PassportHeader.tsx   # User profile header
│   │   ├── StampCard.tsx        # Location visit stamps
│   │   └── TicketWallet.tsx     # QR code ticket management
│   ├── ui/                      # Shadcn UI components
│   └── ThemeProvider.tsx        # Dark/light mode provider
├── pages/
│   ├── home.tsx                 # Landing page with clickable spotlight cards
│   ├── jelajah.tsx              # Explore destinations with API data
│   ├── komunitas.tsx            # Community hub with API mutations
│   ├── dampak.tsx               # Impact dashboard
│   ├── profil.tsx               # User sea-passport with edit dialog
│   ├── stream.tsx               # Social media content aggregation
│   └── riset-detail.tsx         # Research report detail page
└── App.tsx                      # Main app with routing
```

### Key Features
1. **Navigation**: 5 menu items (Jelajah, Komunitas, Dampak, Profil, Stream) + floating ticket button
2. **Landing Page**: Full-screen hero, live ticker, clickable spotlight cards with toast feedback
3. **Explore Page**: Interactive map with 8 marine locations (API-driven, realtime slot availability)
4. **Community Hub**: Trip Buddy, Sea-Log feed, Events calendar with API mutations
5. **Impact Dashboard**: Fund allocation, coral adoption map, research highlights
6. **Sea-Passport**: Gamified profile with stamps, levels, QR tickets
7. **Stream Page**: Social media content aggregation (TikTok, Instagram, YouTube) with platform filtering

### Design System
- **Fonts**: Inter (body), Montserrat (display)
- **Colors**: Ocean-themed with teal primary color
- **Theme**: Light/dark mode support
- **Mobile-first**: Bottom navigation on mobile

## Technologies
- React + TypeScript + Vite
- Tailwind CSS + Shadcn UI
- Wouter (routing)
- React Query (data fetching)
- QRCode.react (ticket QR codes)
- Express.js (backend)
- PostgreSQL + Drizzle ORM (database)

## API Endpoints

### Locations
- `GET /api/locations` - Get all marine conservation locations
- `GET /api/locations/:id` - Get single location by ID

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user with email/password
- `POST /api/auth/logout` - Log out and end session
- `GET /api/auth/user` - Get authenticated user profile
- `POST /api/auth/forgot-password` - Request password reset email
- `POST /api/auth/reset-password` - Reset password with token

### User
- `GET /api/user/me` - Get current user profile (authenticated or demo user)
- `PATCH /api/user/me` - Update user profile (firstName, lastName) - requires auth
- `POST /api/user/change-password` - Change password (currentPassword, newPassword, confirmPassword) - requires auth

### Tickets
- `GET /api/tickets` - Get user's tickets
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create new ticket with payment (paymentMethod, totalPrice, paymentDeadline)
- `PATCH /api/tickets/:id/status` - Update ticket status
- `PATCH /api/tickets/:id/confirm-payment` - Confirm payment and update status to "paid"

### Trip Buddy
- `GET /api/trip-buddies` - Get all trip listings
- `GET /api/trip-buddies/:id` - Get single trip
- `POST /api/trip-buddies` - Create new trip listing
- `POST /api/trip-buddies/:id/join` - Join a trip

### Sea-Log (Community Posts)
- `GET /api/sea-log` - Get all posts
- `GET /api/sea-log/:id` - Get single post
- `POST /api/sea-log` - Create new post
- `POST /api/sea-log/:id/like` - Like a post

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/register` - Register for event

### Coral Adoptions
- `GET /api/corals` - Get all adopted corals
- `GET /api/corals/me` - Get user's adopted corals
- `POST /api/corals` - Adopt a coral

### Location Stamps
- `GET /api/stamps` - Get user's location stamps
- `POST /api/stamps` - Create new stamp

### Impact & Statistics
- `GET /api/impact` - Get conservation impact stats
- `GET /api/fund-allocation` - Get fund allocation breakdown
- `GET /api/research` - Get research highlights

### Content
- `GET /api/ticker` - Get live ticker data
- `GET /api/spotlight` - Get spotlight items

## User Preferences
- Language: Indonesian (Bahasa Indonesia)
- Target audience: Gen Z/Millennials
- Design philosophy: "Less Navigation, More Immersion"

## Recent Changes
- 2025-12-18: Added in-profile password change feature (no email required)
- 2025-12-18: Fixed community page images to use Unsplash URLs for events and sea-log posts
- 2025-12-10: Implemented QRIS and Bank Transfer payment methods in ticket booking flow
- 2025-12-10: Added 4-step booking flow: Schedule → Confirmation → Payment → Success
- 2025-12-10: Added 7-hour payment countdown timer with conditional ticket download
- 2025-12-10: Updated TicketWallet to show payment status badges (Pending/Paid/Expired)
- 2025-12-10: Fixed profile page to fetch tickets from API instead of hardcoded data
- 2025-12-10: Added realtime slot availability - slots decrement when tickets are purchased
- 2025-12-10: Added 4 new marine destinations (Wakatobi, Komodo, Bunaken, Derawan) with generated images
- 2025-12-10: Total destinations now 8 with proper cache invalidation after purchases
- 2025-12-09: Integrated Resend email service for password reset emails
- 2025-12-09: Added forgot password flow with email sending (server/email.ts)
- 2025-12-08: Migrated from Replit Auth to email/password authentication with bcryptjs
- 2025-12-08: Added Zod validation for login/register API endpoints
- 2025-12-08: Created login/register page with toggle between modes
- 2025-12-08: Fixed calendar bug to allow same-day ticket bookings using startOfDay()
- 2025-12-08: Added Stream page for social media content aggregation (TikTok, Instagram, YouTube)
- 2025-12-08: Made all features clickable with toast feedback and proper navigation
- 2025-12-08: Updated pages to use real API calls with TanStack Query mutations
- 2025-12-08: Migrated to PostgreSQL database with Drizzle ORM
- 2025-12-08: Initial frontend prototype with all pages and components
