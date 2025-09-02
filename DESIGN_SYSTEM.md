# MeQasa Design System

> A comprehensive design system for Ghana's leading real estate platform

## 🎨 Brand Identity

### Brand Colors

#### Primary Brand Colors
```css
/* Primary Brand (Pink/Rose) */
--brand-primary: 349 98% 66%        /* #ff3366 - Main brand color */
--brand-primary-dark: 349 74% 60%   /* #d1214a - Darker variant */
--brand-primary-light: 349 100% 97% /* #fff1f4 - Light variant */

/* Secondary Brand (Dark Blue) */
--brand-secondary: 240 18% 18%      /* #252a3d - Secondary dark */
--brand-secondary-light: 240 5% 92% /* #eaeaec - Light variant */
--brand-secondary-dark: 240 19% 16% /* #1f2333 - Darker variant */

/* Accent Brand (Navy) */
--brand-accent: 233 53% 23%         /* #1b2951 - Navigation/accents */
```

#### Functional Colors
```css
/* System Colors */
--brand-blue: 221 100% 56%          /* #0066ff - Links/actions */
--brand-muted: 231 15% 54%          /* #7a7d8a - Muted text */
--brand-gray: 0 0% 97%              /* #f7f7f7 - Background gray */

/* Status Colors */
--brand-badge-verified: 161 76% 41%   /* #14a85f - Verified agents */
--brand-badge-ongoing: 44 100% 52%    /* #ff8800 - Ongoing projects */
--brand-badge-completed: 137 63% 39%  /* #2d7738 - Completed projects */
```

### Color Usage Guidelines

#### Primary Colors Usage
- **Brand Primary**: Main CTAs, key actions, featured elements
- **Brand Secondary**: Headers, navigation, important text
- **Brand Accent**: Property prices, highlights, badges

#### Functional Colors Usage  
- **Brand Blue**: Links, secondary actions
- **Brand Muted**: Supporting text, meta information
- **Status Colors**: Project status, verification badges

## 📐 Typography

### Font Hierarchy

```css
/* Base Font Settings */
--font-size: 14px;
--font-weight-normal: 400;
--font-weight-medium: 500;

/* Property Card Typography */
.property-title {
  font-size: 0.875rem;      /* 14px */
  font-weight: 700;
  line-height: 1.5;
  color: hsl(var(--brand-primary));
}

.property-price {
  font-size: 1rem;          /* 16px */
  font-weight: 700;
  color: hsl(var(--brand-accent));
}

.property-location {
  font-size: 1rem;          /* 16px */
  font-weight: 400;
  color: hsl(var(--brand-muted));
}

.property-features {
  font-size: 1rem;          /* 16px */
  font-weight: 400;
  color: hsl(var(--brand-muted));
}
```

## 🏗️ Component Architecture

### PropertyCard Design Patterns

#### Default PropertyCard
- **Aspect Ratio**: 4:3 for property images
- **Border Radius**: `0.625rem` (10px)
- **Shadow**: None (transparent background)
- **Hover**: Subtle transitions (200ms duration)

#### Featured PropertyCard
- **Enhancement**: Subtle ring highlight
- **Ring Color**: `hsl(var(--brand-primary) / 0.2)`
- **Additional Badge**: "Featured" in amber

#### Spacing System
```css
/* Consistent spacing scale */
.card-padding-none: 0;
.card-padding-sm: 1rem;      /* 16px */
.card-padding-default: 1.5rem; /* 24px */
.card-padding-lg: 2rem;      /* 32px */
```

### Button System

#### Primary Button
```css
.btn-primary {
  background: hsl(var(--brand-primary));
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: hsl(var(--brand-secondary));
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
}
```

### Badge System

#### Contract Type Badges
```css
.badge-for-sale {
  background: hsl(var(--brand-accent));
  color: white;
  text-transform: capitalize;
}

.badge-for-rent {
  background: hsl(var(--brand-accent));
  color: white;
  text-transform: capitalize;
}

.badge-featured {
  background: hsl(44 100% 52%);  /* Amber */
  color: white;
}
```

## 🎯 Interactive States

### Focus Management
```css
.focus-ring {
  focus-visible:outline-none;
  focus-visible:ring-2;
  focus-visible:ring-ring;
  focus-visible:ring-offset-2;
}
```

### Hover States
```css
.hover-subtle {
  transition: box-shadow 200ms ease;
}

.hover-subtle:hover {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.hover-elevated {
  transition: all 200ms ease;
}

.hover-elevated:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transform: scale(1.02);
}
```

### Loading States
```css
.loading-skeleton {
  background: hsl(var(--primary) / 0.1);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 0.375rem;
}
```

## 📱 Responsive Breakpoints

### MeQasa Breakpoint System
```css
/* Mobile First Approach */
.mobile {
  /* Default: 0px and up */
}

.tablet {
  @media (min-width: 768px) {
    /* Tablet: 768px and up */
  }
}

.desktop {
  @media (min-width: 1024px) {
    /* Desktop: 1024px and up */
  }
}

.large-desktop {
  @media (min-width: 1280px) {
    /* Large Desktop: 1280px and up */
  }
}
```

### PropertyCard Responsive Behavior
```css
.property-card {
  /* Mobile: Full width */
  width: 100%;
}

@media (min-width: 768px) {
  .property-card {
    /* Tablet: 2 columns */
    width: 48%;
  }
}

@media (min-width: 1024px) {
  .property-card {
    /* Desktop: 3-4 columns */
    width: 32%;
  }
}
```

## 🔧 Component Variants

### PropertyCard Variants
```tsx
// Default - preserves existing design
<PropertyCard listing={listing} />

// Featured - adds subtle ring highlight
<PropertyCard listing={listing} variant="featured" />

// Compact - smaller for list views
<PropertyCard listing={listing} variant="compact" />

// Enhanced hover - scale and shadow
<PropertyCard listing={listing} hover="elevated" />
```

### SearchInput Variants
```tsx
// Default search with autocomplete
<SearchInput 
  searchValue={value}
  onSearchChange={setValue}
/>
```

### AddFavoriteButton States
```tsx
// Toggle button with visual feedback
<AddFavoriteButton 
  listingId={id}
  // Auto-detects favorite status
/>
```

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Text on Brand Primary**: Minimum 4.5:1 ratio
- **Text on Brand Secondary**: Minimum 4.5:1 ratio  
- **Interactive Elements**: Clear visual indicators

#### Keyboard Navigation
- **Tab Order**: Logical sequence
- **Focus Indicators**: Visible ring/outline
- **Skip Links**: For main content areas

#### Screen Reader Support
- **ARIA Labels**: All interactive elements
- **Semantic HTML**: Proper heading hierarchy
- **Live Regions**: Dynamic content updates

## 📊 Usage Guidelines

### Do's ✅
- Use brand primary for main CTAs
- Maintain consistent spacing scale
- Follow hover state patterns
- Implement proper focus management
- Use semantic HTML structure

### Don'ts ❌
- Don't mix different button styles
- Don't break the color hierarchy
- Don't skip accessibility features
- Don't ignore mobile-first approach
- Don't override brand colors

## 🚀 Implementation Examples

### Property Listing Page
```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {properties.map((property) => (
    <PropertyCard 
      key={property.id}
      listing={property}
      variant={property.featured ? "featured" : "default"}
      hover="subtle"
      priority={index < 6} // Above fold images
    />
  ))}
</div>
```

### Search Interface
```tsx
<SearchForm 
  type={contractType}
  formState={formState}
  updateFormState={updateFormState}
>
  <SearchInput 
    searchValue={formState.search}
    onSearchChange={(value) => updateFormState({ search: value })}
  />
</SearchForm>
```

---

*This design system ensures consistency across the MeQasa platform while preserving your beautiful existing designs and following modern accessibility standards.*