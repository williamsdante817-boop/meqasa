# Meqasa Real Estate Platform

A modern real estate web application for discovering, listing, and exploring properties, developers, and agents in Ghana. Built with Next.js, TypeScript, and Tailwind CSS.

---

## Tech Stack

- **Next.js** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI**
- **Embla Carousel**
- **Lucide Icons**
- **ESLint & Prettier**

---

## Features

- **Home Page Dashboard**: Hero banner, featured projects carousel, latest and featured property listings, partner/agent logos, and blog/news sections.
- **Property Listings**: Browse, search, and filter properties for sale or rent. Detailed property pages with images, amenities, mortgage calculator, and contact options.
- **Developer Projects**: Explore real estate development projects, view project details, floor plans, amenities, and contact developers.
- **Agents Directory**: Browse and search for real estate agents, view agent profiles, and their property listings.
- **Developers Directory**: List of trusted real estate developers, with profile pages and client reviews.
- **Unit Details**: Detailed view for individual units, including price, features, images, and mortgage calculator.
- **Search**: Advanced property search with filters for type, location, price, and more.
- **Favorites**: Add properties to favorites (UI present; backend integration in progress).
- **Responsive Design**: Fully responsive and mobile-friendly UI.
- **Accessibility**: ARIA roles and keyboard navigation in key components.

---

## Progress So Far

- [x] Core page structure and navigation implemented (Home, Listings, Agents, Developers, Projects, Search)
- [x] Featured projects and listings carousel
- [x] Property and unit detail pages with amenities, images, and mortgage calculator
- [x] Developer and agent directories with profile pages
- [x] Blog/news and market insights section
- [x] Responsive and accessible UI components
- [x] Utility hooks, types, and configuration for scalability
- [ ] Favorites backend and user authentication (in progress)
- [ ] Automated tests and CI/CD (planned)

---

## Getting Started

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Visit [http://localhost:3000](http://localhost:3000)

---

## Code Quality & Bundle Optimization

**Automated Unused Code Detection:**

This project uses `eslint-plugin-unused-imports` to automatically detect and prevent unused code:

- **Unused imports** are flagged as errors and must be removed
- **Unused variables** are flagged as warnings (except those prefixed with `_`)
- Run `npm run lint` to check for unused code
- Run `npm run lint:fix` to automatically remove unused imports

**Bundle Size Optimization:**
- Unused exports and imports increase bundle size unnecessarily
- The linting rules help maintain a lean codebase
- Regular code audits ensure optimal performance

---

## Scroll Behavior

**Intentional Scroll Management Strategy:**

This application implements custom scroll management to enhance user experience:

- **ScrollToTop Component**: Automatically scrolls to top on route changes for consistent navigation experience
- **DisableScrollRestoration**: Disables browser's native scroll restoration to prevent conflicts with our custom implementation
- **Back to Top Button**: Manual scroll-to-top button in footer for user convenience

**Implementation Details:**
- `ScrollToTop.tsx` - Client component that resets scroll position on pathname changes
- `DisableScrollRestoration.tsx` - Sets `history.scrollRestoration = 'manual'` to prevent browser interference
- `scroll-to-top.tsx` - Footer button component with smooth scroll behavior

**Guidelines:**
- These components are intentionally used together in the root layout
- For features requiring scroll preservation (e.g., modal interactions), use `scroll: false` in Next.js Link components
- Custom scrollable containers should manage their own scroll state independently

---

## License

This project is for demonstration and educational purposes.
