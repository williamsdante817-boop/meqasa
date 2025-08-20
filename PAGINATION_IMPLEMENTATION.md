# Pagination Implementation for Developer Tabs

## Overview

This implementation adds pagination functionality to the developer tabs content, showing a maximum of 6 items per page with pagination controls for tabs that have more than 6 items.

## Components Created

### 1. `usePagination` Hook (`src/hooks/use-pagination.ts`)

A custom React hook that handles pagination logic:

- Manages current page state
- Calculates total pages
- Provides navigation functions (next, previous, go to specific page)
- Returns current items for the current page

### 2. `PaginatedContent` Component (`src/components/paginated-content.tsx`)

A reusable component that renders paginated content:

- Generic component that works with any data type
- Configurable grid layout
- Built-in pagination controls
- Responsive design with mobile-friendly navigation

### 3. Updated `DeveloperTabs` Component

Modified to use the new pagination system:

- Each tab content now uses `PaginatedContent`
- Maximum of 6 items per page
- Pagination only shows when there are more than 6 items
- Maintains existing grid layouts for different content types

## Features

### Pagination Controls

- **Previous/Next buttons**: Navigate between pages
- **Page numbers**: Direct navigation to specific pages
- **Ellipsis**: Shows when there are many pages (smart truncation)
- **Responsive**: Previous/Next text hidden on small screens

### Smart Page Display

- Shows all pages if total ≤ 5
- For more pages: shows first, last, and pages around current
- Ellipsis indicators for skipped page ranges

### Conditional Display

- Pagination only appears when there are more than 6 items
- Empty state handling for tabs with no content
- Maintains existing alert cards for empty states

## Usage

### Basic Usage

```tsx
<PaginatedContent
  items={dataArray}
  itemsPerPage={6}
  renderItem={(item, index) => <YourComponent item={item} />}
  gridClassName="grid grid-cols-2 gap-4"
  emptyMessage="No items found"
  showPagination={dataArray.length > 6}
/>
```

### In Developer Tabs

The component automatically handles:

- Current Projects tab
- Available Units tab
- Past Projects tab

Each tab shows max 6 items with pagination if needed.

## Styling

- Uses existing UI components (Button, Pagination)
- Responsive design with mobile-first approach
- Consistent with existing design system
- Proper spacing and typography

## Technical Details

- **Client Components**: Both `DeveloperTabs` and `PaginatedContent` are client components
- **TypeScript**: Full type safety with generics
- **Performance**: Uses `useMemo` for efficient item slicing
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **State Management**: Local state per component instance

## Benefits

1. **Better UX**: Users can navigate through large lists easily
2. **Performance**: Only renders visible items
3. **Responsive**: Works well on all screen sizes
4. **Reusable**: Can be used in other parts of the application
5. **Maintainable**: Clean separation of concerns
6. **Type Safe**: Full TypeScript support
