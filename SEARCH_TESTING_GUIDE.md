# 🧪 Enhanced Search Testing Guide

## Quick Test URLs
- Rent in Accra: `http://localhost:3002/search/rent/accra`
- Sale in Tema: `http://localhost:3002/search/sale/tema` 
- Sale in East Legon: `http://localhost:3002/search/sale/east-legon`

## ✅ Features to Test

### **React Query Enhancements**
- [ ] **Background Refresh**: Look for green "🔄 Refreshing..." indicator
- [ ] **Smart Caching**: Navigate away and back - results load instantly
- [ ] **Console Logs**: Open DevTools → Console for detailed React Query state
- [ ] **Error Handling**: Try invalid search params - graceful fallbacks

### **Mobile Infinite Scroll** (Resize to < 768px)
- [ ] **Auto-loading**: Scroll near bottom → automatic load more
- [ ] **Load More Button**: Manual button works when auto-load fails
- [ ] **Progress Counter**: Shows "X of Y properties" 
- [ ] **End Message**: "✨ You've seen all X properties!" when done
- [ ] **No Pagination**: Pagination hidden on mobile

### **Desktop Pagination** (Width > 768px)  
- [ ] **Traditional Pagination**: Page numbers visible at bottom
- [ ] **Smooth Transitions**: No flickering between pages
- [ ] **URL Updates**: Page changes update URL correctly
- [ ] **No Infinite Scroll**: Load more button hidden on desktop

### **Performance & UX**
- [ ] **SSR**: First load shows server-rendered results immediately
- [ ] **Type Safety**: No TypeScript errors in console
- [ ] **Responsive**: Smooth transition between mobile/desktop modes
- [ ] **Accessibility**: Pagination and buttons keyboard accessible

## 🛠️ Developer Tools

### Console Logs to Monitor
Look for these in browser console:
```
🚀 Enhanced Search State: {
  isLoading: false,
  isFetching: true, 
  isStale: false,
  isBackgroundRefreshing: true,
  hasError: false,
  cacheHit: true,
  resultsCount: 20,
  strategy: "hybrid-desktop-mobile"
}
```

### Network Tab
- Initial page load: Server-side rendered HTML
- Subsequent searches: API calls to `/api/properties`
- Background refreshes: Automatic API calls without loading states

### React DevTools  
- Search for "QueryClient" in components tree
- Check React Query cache in DevTools extension
- Monitor state changes in real-time

## 🐛 Common Issues to Watch For

- **Mobile scroll not working**: Check viewport width detection
- **Desktop pagination missing**: Verify responsive CSS classes
- **Background refresh not appearing**: Check network throttling
- **TypeScript errors**: Open browser console for any TS issues
- **Cache not working**: Clear browser cache and test again

## 🎯 Success Criteria

✅ **Mobile users** get smooth infinite scroll experience  
✅ **Desktop users** keep familiar pagination  
✅ **All users** benefit from React Query caching  
✅ **No breaking changes** to existing functionality  
✅ **Performance improvements** are noticeable  

## 🔄 Toggle Between Versions

To test original vs enhanced:

```typescript
// In src/app/(lobby)/search/[type]/SearchResultsWrapper.tsx
const USE_ENHANCED_SEARCH = false; // Original version
const USE_ENHANCED_SEARCH = true;  // Enhanced version
```

## 📊 Performance Comparison

Test both versions and compare:
- **First load time**: Should be identical (SSR)
- **Navigation speed**: Enhanced should be faster
- **Memory usage**: Enhanced should cache intelligently
- **Network requests**: Enhanced should make fewer API calls