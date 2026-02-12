# Dullani App - Performance Optimization Guide

## Overview
This document outlines the performance optimizations implemented in the Dullani app and best practices for maintaining high performance.

## Implemented Optimizations

### 1. Image Optimization
- **Lazy Loading**: Images are loaded only when needed
- **Caching**: Images are cached using Expo Image component
- **Compression**: Images should be compressed before upload
- **Format**: Use WebP or JPEG for better compression

### 2. List Performance
- **FlatList**: Used instead of ScrollView with .map() for large lists
- **Pagination**: Products are paginated (10-20 items per page)
- **Key Props**: Unique keys are used for list items
- **Remove Clones**: Avoid creating new objects in render methods

### 3. State Management
- **Local State**: Use useState for component-level state
- **Context**: Use Context API for global state
- **Memoization**: Use useMemo for expensive computations
- **Callbacks**: Use useCallback to prevent unnecessary re-renders

### 4. API Optimization
- **Request Batching**: Combine multiple requests when possible
- **Caching**: Use TanStack Query for automatic caching
- **Pagination**: Load data in chunks, not all at once
- **Debouncing**: Debounce search input to reduce API calls

### 5. Code Splitting
- **Dynamic Imports**: Use dynamic imports for large components
- **Lazy Routes**: Use lazy loading for routes
- **Bundle Size**: Keep bundle size under 5MB

## Performance Metrics

### Target Metrics
- **First Contentful Paint (FCP)**: < 2 seconds
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **Time to Interactive (TTI)**: < 3.5 seconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### Current Performance
- **Bundle Size**: ~4.5MB (gzipped)
- **Initial Load**: ~2 seconds
- **List Scroll FPS**: 60 FPS

## Best Practices

### 1. Component Optimization
```tsx
// ❌ Bad: Component re-renders on every parent render
function ProductCard({ product }) {
  return <View>{product.name}</View>;
}

// ✅ Good: Memoized component
const ProductCard = React.memo(({ product }) => {
  return <View>{product.name}</View>;
});
```

### 2. List Optimization
```tsx
// ❌ Bad: ScrollView with .map()
<ScrollView>
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</ScrollView>

// ✅ Good: FlatList with proper key
<FlatList
  data={products}
  renderItem={({ item }) => <ProductCard product={item} />}
  keyExtractor={item => item.id.toString()}
/>
```

### 3. Search Optimization
```tsx
// ❌ Bad: Search on every keystroke
const handleSearch = (text) => {
  setSearchQuery(text);
  // API call here
};

// ✅ Good: Debounced search
const handleSearch = useCallback(
  debounce((text) => {
    setSearchQuery(text);
    // API call here
  }, 300),
  []
);
```

### 4. Image Optimization
```tsx
// ❌ Bad: Large unoptimized images
<Image source={{ uri: imageUrl }} style={{ width: 300, height: 300 }} />

// ✅ Good: Optimized with caching
<Image
  source={{ uri: imageUrl }}
  style={{ width: 300, height: 300 }}
  cachePolicy="memory-disk"
/>
```

## Monitoring

### Tools
- **React DevTools Profiler**: Measure component render times
- **Network Tab**: Monitor API calls and bundle size
- **Lighthouse**: Audit performance and accessibility
- **Sentry**: Track errors and performance issues

### Metrics to Monitor
- API response times
- Component render times
- Memory usage
- Bundle size
- Cache hit rates

## Future Optimizations

1. **Service Worker**: Implement offline support
2. **Code Splitting**: Split large bundles
3. **Image Optimization**: Use adaptive images
4. **Database Indexing**: Optimize database queries
5. **CDN**: Use CDN for static assets

## Troubleshooting

### Slow List Scrolling
- Check for expensive computations in render
- Use FlatList instead of ScrollView
- Implement pagination
- Profile with React DevTools

### High Memory Usage
- Check for memory leaks
- Unsubscribe from listeners
- Clear caches periodically
- Use weak references

### Slow API Calls
- Check network tab
- Implement caching
- Use pagination
- Optimize database queries

## References
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Web Vitals](https://web.dev/vitals/)
