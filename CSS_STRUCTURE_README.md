# CSS Structure Implementation Guide

## Quick Start

This guide explains how to use the CSS organization structure implemented in the Figma-Make frontend.

## CSS Files Overview

### 1. Global Styles (`src/styles/globals.css`)
- **Purpose**: Base styles, CSS variables, and global resets
- **Usage**: Automatically imported, no manual import needed
- **Content**: CSS custom properties, Tailwind directives, base element styles

### 2. Component Styles (`src/styles/components.css`)
- **Purpose**: Global component styles that apply across the application
- **Usage**: Automatically imported, use classes directly in components
- **Examples**: `.btn-primary`, `.card`, `.form-input`

### 3. Utility Styles (`src/styles/utilities.css`)
- **Purpose**: Custom utility classes extending Tailwind
- **Usage**: Automatically imported, use classes directly in components
- **Examples**: `.text-gradient`, `.bg-glass`, `.flex-center`

### 4. Theme Styles (`src/styles/themes.css`)
- **Purpose**: Theme switching and dark mode support
- **Usage**: Automatically imported, use theme-aware classes
- **Examples**: `.theme-card`, `.theme-button`, `.theme-bg`

## How to Use

### 1. Using Global Component Classes

```tsx
// These classes are available everywhere
<button className="btn-primary">Primary Button</button>
<div className="card card-hover">Card Content</div>
<input className="form-input" placeholder="Enter text" />
```

### 2. Using Utility Classes

```tsx
// Custom utility classes
<div className="text-gradient">Gradient Text</div>
<div className="bg-glass">Glass Effect</div>
<div className="flex-center">Centered Content</div>
```

### 3. Using Theme-Aware Classes

```tsx
// Theme-aware components
<div className="theme-card">Theme Card</div>
<button className="theme-button">Theme Button</button>
<input className="theme-input" placeholder="Theme Input" />
```

### 4. Creating Component-Specific Styles

For component-specific styles that can't be achieved with Tailwind or global classes:

```tsx
// 1. Create CSS module file
// src/components/MyComponent/MyComponent.module.css

// 2. Import in component
import styles from './MyComponent.module.css';

// 3. Use in JSX
<div className={`${styles.container} bg-white p-4`}>
  <h2 className={styles.title}>Component Title</h2>
</div>
```

## CSS Module Example

### File Structure
```
src/components/ui/button/
├── Button.tsx
├── button.module.css
└── index.ts
```

### CSS Module Usage
```tsx
// Button.tsx
import styles from './button.module.css';

export const Button = ({ variant = 'primary', size = 'medium', children, ...props }) => {
  const buttonClasses = [
    styles.buttonContainer,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]
  ].join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};
```

## Best Practices

### 1. CSS Class Priority
1. **First**: Use Tailwind utility classes
2. **Second**: Use global component classes from `components.css`
3. **Third**: Use utility classes from `utilities.css`
4. **Fourth**: Use component-specific CSS modules
5. **Last**: Use theme-aware classes when needed

### 2. Naming Conventions
- **CSS Files**: `component-name.module.css`
- **CSS Classes**: Use kebab-case (e.g., `.button-container`)
- **CSS Variables**: Use kebab-case with `--scan-` prefix for brand colors

### 3. Responsive Design
```tsx
// Use responsive utilities
<div className="grid-responsive">Responsive Grid</div>
<div className="text-responsive-lg">Responsive Text</div>
<div className="space-y-responsive">Responsive Spacing</div>
```

### 4. Theme Switching
```tsx
// Theme-aware components automatically adapt
<div className="theme-card theme-transition">
  This card adapts to light/dark themes
</div>
```

## Common Patterns

### 1. Button Variants
```tsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>
```

### 2. Card Layouts
```tsx
<div className="card">Basic Card</div>
<div className="card card-hover">Hoverable Card</div>
<div className="card card-elevated">Elevated Card</div>
```

### 3. Form Elements
```tsx
<label className="form-label">Input Label</label>
<input className="form-input" />
<div className="form-error">Error message</div>
```

### 4. Status Indicators
```tsx
<span className="status-success">Success</span>
<span className="status-warning">Warning</span>
<span className="status-error">Error</span>
<span className="status-info">Info</span>
```

## Troubleshooting

### 1. Styles Not Loading
- Check import order in `main.tsx`
- Verify CSS files exist in `src/styles/`
- Check browser console for errors

### 2. Tailwind Classes Not Working
- Verify `tailwind.config.js` content paths
- Check PostCSS configuration
- Clear build cache if needed

### 3. CSS Variables Not Defined
- Check variable definitions in `globals.css`
- Verify import order
- Check for typos in variable names

## Development Workflow

### 1. Adding New Global Styles
```bash
# Add to appropriate CSS file
# - globals.css: Base styles and variables
# - components.css: Global component styles
# - utilities.css: Custom utility classes
# - themes.css: Theme-related styles
```

### 2. Adding New Components
```bash
# Create component directory
mkdir src/components/ui/new-component

# Create files
touch src/components/ui/new-component/NewComponent.tsx
touch src/components/ui/new-component/new-component.module.css
touch src/components/ui/new-component/index.ts
```

### 3. Testing Styles
```bash
# Start development server
npm run dev

# Check styles in browser
# Use browser dev tools to inspect CSS
# Verify responsive behavior
# Test theme switching
```

## Performance Tips

### 1. CSS Bundle Size
- Use Tailwind's purge configuration
- Avoid unused CSS imports
- Use CSS modules for component-specific styles

### 2. Critical CSS
- Load critical styles inline
- Defer non-critical CSS
- Use CSS-in-JS sparingly

### 3. Caching
- Use content hashing for CSS files
- Implement proper cache headers
- Use CDN for external fonts

## Accessibility

### 1. Color Contrast
- Use theme-aware colors for proper contrast
- Test with high contrast mode
- Support reduced motion preferences

### 2. Focus Indicators
- Use `.focus-ring` utility for focus states
- Ensure keyboard navigation works
- Test with screen readers

## Future Considerations

### 1. CSS-in-JS
- Consider styled-components for dynamic styles
- Use CSS modules for component isolation
- Implement CSS custom properties for theming

### 2. Performance Monitoring
- Monitor CSS bundle size
- Track CSS performance metrics
- Implement CSS loading optimization

---

## Summary

This CSS structure provides:
- ✅ **Consistency**: Standardized approach across components
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Performance**: Optimized CSS loading and processing
- ✅ **Scalability**: Modular approach for future growth
- ✅ **Accessibility**: Built-in support for various user preferences

Follow this guide to maintain consistency and avoid the CSS issues documented in `ISSUES_AND_FIXES.md`. 