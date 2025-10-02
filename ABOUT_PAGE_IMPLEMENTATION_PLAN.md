# About Page Enhancement Plan

## Overview

Enhance the About page to match the live Meqasa site at https://meqasa.com/about-us

## Current State

Location: `/src/app/(lobby)/about/page.tsx`

### Live Site Structure (from https://meqasa.com/about-us) ✅

1. **About Us** - Heading + description paragraph
2. **Our Mission** - Text section
3. **Our Vision** - Text section
4. **Featured Properties** - Carousel/slider
5. **Quick Links Sections** - Office Spaces, Apartments for Rent, Houses for Sale, Houses for Rent

### Current Implementation Status

- ✅ About Us heading + description
- ✅ Our Mission section
- ✅ Our Vision section
- ❌ Featured Properties carousel (MISSING)
- ❌ Quick Links sections (MISSING)
- ⚠️ Extra sections not on live site (need to remove): "What We Do", "Why Choose MeQasa", CTA section

## Implementation Plan

### Phase 1: Featured Properties Carousel Component

**File:** `/src/components/about/featured-properties-carousel.tsx`

**Purpose:** Display a carousel of featured properties similar to the live site

**Features:**

- Fetch from existing API: `/api/homepage/featured-listings`
- Responsive carousel with navigation arrows
- Show mix of rental and sale properties
- Auto-scroll with pause on hover
- Display 3-4 properties at a time (desktop), 1-2 (mobile)

**Dependencies:**

- Use existing `PropertyCard` or `TrendingPropertyCard` component
- React carousel library (e.g., `embla-carousel-react` or `swiper`)
- Existing property types and API

**Data Flow:**

```
Featured Properties API (/api/homepage/featured-listings)
  ↓
FeaturedPropertiesCarousel Component
  ↓
PropertyCard Components (reusable)
```

**Component Structure:**

```tsx
<section className="bg-gray-50 py-12">
  <div className="container">
    <h2>Featured Properties</h2>
    <Carousel>
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </Carousel>
    <CarouselNavigation />
  </div>
</section>
```

### Phase 2: Property Quick Links Component

**File:** `/src/components/about/property-quick-links.tsx`

**Purpose:** Display grid of quick links to popular property searches

**Features:**

- 4 main sections: Office Spaces, Apartments for Rent, Houses for Sale, Houses for Rent
- Each section shows 8 location-based links
- Links point to search pages with pre-filled filters
- Responsive grid layout

**Data Source:**
Use existing `siteConfig.footerNav` from `/src/config/site.ts`

**Component Structure:**

```tsx
<section className="py-12">
  <div className="container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
    <QuickLinksColumn title="Office Spaces" links={officeLinks} />
    <QuickLinksColumn title="Apartments for Rent" links={apartmentLinks} />
    <QuickLinksColumn title="Houses for Sale" links={housesForSaleLinks} />
    <QuickLinksColumn title="Houses for Rent" links={housesForRentLinks} />
  </div>
</section>
```

**Link Format:**

```tsx
<Link
  href="/search/rent?q=accra&ftype=office"
  className="hover:text-primary text-sm text-gray-600"
>
  Accra
</Link>
```

### Phase 3: Update About Page

**File:** `/src/app/(lobby)/about/page.tsx`

**Changes:**

1. Import new components
2. Remove sections not on live site ("What We Do", "Why Choose MeQasa", CTA)
3. Add Featured Properties carousel
4. Add Property Quick Links sections
5. Match exact structure of live site

**New Page Structure (Matching Live Site):**

```tsx
export default async function About() {
  // Fetch featured properties on server
  const featuredListings = await getFeaturedListings();

  return (
    <>
      <StructuredData data={structuredData} />
      <Shell>
        {/* 1. About Us Heading + Description */}
        <div className="mb-12">
          <h1 className="text-brand-accent mb-6 text-3xl font-bold">
            About Us
          </h1>
          <p className="text-brand-muted leading-relaxed">
            meQasa helps you find residential and commercial property to rent or
            buy in Ghana. Our website features thousands of options in the
            capital of Accra, Tema, and the other regions, whether you are
            looking to buy or rent a new home or office space. meQasa is your
            total solutions partner as you go through your property search,
            offering countless housing alternatives as well as offline support
            and expert advice on the real estate industry in Ghana.
          </p>
        </div>

        {/* 2. Mission Section */}
        <div className="mb-12">
          <h2 className="text-brand-accent mb-4 text-2xl font-bold">
            Our Mission
          </h2>
          <p className="text-brand-muted leading-relaxed">
            We collaborate with brokers, owners and tenants to create complete
            and dynamic property profiles. We advertise online all adequately
            profiled properties that are vacant. meQasa facilitates
            communication and meetings between prospective tenants and owners or
            their representatives.
          </p>
        </div>

        {/* 3. Vision Section */}
        <div className="mb-12">
          <h2 className="text-brand-accent mb-4 text-2xl font-bold">
            Our Vision
          </h2>
          <p className="text-brand-muted leading-relaxed">
            meQasa is working toward an efficient housing search experience in
            Africa primarily for prospective tenants. We aspire to be the source
            of reliable information on housing in Africa.
          </p>
        </div>
      </Shell>

      {/* 4. Featured Properties Carousel - NEW */}
      <FeaturedPropertiesCarousel initialData={featuredListings} />

      {/* 5. Property Quick Links - NEW */}
      <PropertyQuickLinks />
    </>
  );
}
```

## Technical Specifications

### Component Props

**FeaturedPropertiesCarousel:**

```typescript
interface FeaturedPropertiesCarouselProps {
  initialData?: {
    rentals: PropertyListing[];
    selling: PropertyListing[];
  };
  showTitle?: boolean;
  autoScroll?: boolean;
  autoScrollDelay?: number;
}
```

**PropertyQuickLinks:**

```typescript
interface PropertyQuickLinksProps {
  columns?: QuickLinkColumn[];
  className?: string;
}

interface QuickLinkColumn {
  title: string;
  links: {
    title: string;
    href: string;
  }[];
}
```

### Styling Guidelines (Follow Existing Design System)

**Use Existing Design Tokens:**

Refer to your existing design system and component patterns in the codebase:

- Use existing `Shell` component for container width
- Use existing `PropertyCard` or `TrendingPropertyCard` components
- Follow existing spacing patterns (mb-12, py-8, etc.)
- Use existing color classes from Tailwind config

**Key Design System Classes:**

- Text: `text-brand-accent` (headings), `text-brand-muted` (body)
- Backgrounds: `bg-gray-50` (sections), `bg-white` (cards)
- Spacing: Consistent with existing pages (mb-12, py-8, gap-8)
- Typography: Follow existing heading/paragraph sizes
- Responsive: Match existing breakpoints (md:, lg:)

### Performance Considerations

1. **Featured Properties:**
   - Prefetch data on server (SSR)
   - Pass as initialData to client component
   - Implement loading skeleton for carousel

2. **Quick Links:**
   - Static data from config (no API calls)
   - Server component (no JavaScript needed)
   - SEO-friendly internal links

3. **Images:**
   - Use Next.js `<Image>` component
   - Lazy load carousel images
   - Optimize image sizes

## API Endpoints Used

| Endpoint                          | Purpose                    | Method |
| --------------------------------- | -------------------------- | ------ |
| `/api/homepage/featured-listings` | Featured properties        | GET    |
| `/api/newsletter/subscribe`       | Property alerts (optional) | POST   |

## File Structure

```
src/
├── app/
│   └── (lobby)/
│       └── about/
│           └── page.tsx [MODIFY - Remove extra sections, add carousel & quick links]
├── components/
│   └── about/ [CREATE FOLDER]
│       ├── featured-properties-carousel.tsx [CREATE]
│       └── property-quick-links.tsx [CREATE]
└── config/
    └── site.ts [EXISTING - Use footerNav for quick links data]
```

## Dependencies to Install

```bash
# For carousel functionality
npm install embla-carousel-react
# OR
npm install swiper

# For animations (optional)
npm install framer-motion
```

## Testing Checklist

- [ ] Page structure matches live site exactly
- [ ] Extra sections removed ("What We Do", "Why Choose MeQasa", CTA)
- [ ] Featured properties carousel displays correctly
- [ ] Carousel navigation works (prev/next)
- [ ] Quick links grid shows 4 columns (desktop)
- [ ] All quick links navigate to correct search pages
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Design system classes used consistently
- [ ] Page loads with good performance (SSR)
- [ ] SEO metadata is correct

## Timeline Estimate

- **Phase 1** (Featured Carousel): 2-3 hours
- **Phase 2** (Quick Links): 1-2 hours
- **Phase 3** (Page Update - Remove extra sections, integrate new components): 1 hour
- **Testing & Polish**: 1 hour

**Total**: 5-7 hours

## Live Site Reference

Compare implementation with: https://meqasa.com/about-us

### Exact Structure from Live Site:

**Page Sections (in order):**

1. ✅ About Us (heading + description paragraph)
2. ✅ Our Mission (heading + text)
3. ✅ Our Vision (heading + text)
4. ❌ Featured Properties (carousel - TO ADD)
5. ❌ Quick Links Grid (4 columns - TO ADD)
   - Office Spaces (8 location links)
   - Apartments for Rent (8 location links)
   - Houses for Sale (8 location links)
   - Houses for Rent (8 location links)

**What to Remove:**

- ❌ "What We Do" section (not on live site)
- ❌ "Why Choose MeQasa" section (not on live site)
- ❌ CTA section with buttons (not on live site)

**Featured Properties Details:**

- Carousel/slider with navigation
- Shows mix of rental and sale properties
- Property cards with: image, price, location, beds/baths
- Responsive layout

**Quick Links Details:**

- Simple grid layout (4 columns on desktop)
- Each column has heading + list of location links
- Links go to search pages with filters
- Uses data from existing `siteConfig.footerNav`

## Implementation Steps

1. ✅ Review this plan
2. ⏳ Install carousel dependency (`npm install embla-carousel-react`)
3. ⏳ Create Featured Properties Carousel component
4. ⏳ Create Property Quick Links component
5. ⏳ Update About page:
   - Remove "What We Do" section
   - Remove "Why Choose MeQasa" section
   - Remove CTA section
   - Add Featured Properties carousel
   - Add Quick Links grid
6. ⏳ Test across devices
7. ⏳ Verify against live site (https://meqasa.com/about-us)
8. ⏳ Deploy

## Notes

- **Stick to live site structure only** - Don't add extra sections
- **Follow existing design system** - Use components and classes from codebase
- **Reuse existing components** - PropertyCard, Shell, etc.
- **Keep it simple** - Match live site, no over-engineering
