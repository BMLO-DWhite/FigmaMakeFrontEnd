# CSS Organization Guide for Figma-Make Frontend

## Overview
This document provides a comprehensive guide for organizing CSS files in the Figma-Make React application. It addresses the CSS issues encountered during setup and establishes best practices for future development.

## Current CSS Architecture
- **Framework**: Tailwind CSS v3.4.17 (stable version)
- **Build Tool**: Vite with PostCSS
- **CSS Processing**: PostCSS + Autoprefixer
- **Component Library**: Radix UI + Custom UI components

## CSS File Organization Structure

### 1. Root Level CSS Files
```
figma-make/
├── src/
│   ├── styles/
│   │   ├── globals.css          # Main global styles
│   │   ├── components.css       # Component-specific styles
│   │   ├── utilities.css        # Custom utility classes
│   │   └── themes.css           # Theme variables and dark mode
│   └── ...
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── index.html                   # Entry point with CSS imports
```

### 2. Component-Level CSS Organization
```
src/
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── button/
│   │   │   ├── Button.tsx
│   │   │   ├── button.module.css    # Component-specific styles
│   │   │   └── index.ts
│   │   ├── card/
│   │   │   ├── Card.tsx
│   │   │   ├── card.module.css
│   │   │   └── index.ts
│   │   └── ...
│   ├── auth/                    # Authentication components
│   │   ├── LoginPage.tsx
│   │   ├── login.module.css     # Auth-specific styles
│   │   └── ...
│   └── layout/                  # Layout components
│       ├── Sidebar.tsx
│       ├── sidebar.module.css
│       └── ...
├── pages/                       # Page-level components
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── dashboard.module.css # Page-specific styles
│   │   └── ...
│   └── ...
└── styles/                      # Global styles
    ├── globals.css
    ├── components.css
    ├── utilities.css
    └── themes.css
```

## CSS File Types and Purposes

### 1. Global Styles (`src/styles/globals.css`)
**Purpose**: Application-wide styles, CSS variables, and base resets
**Content**:
- CSS custom properties (CSS variables)
- Global font imports
- Tailwind directives
- Base element resets
- Global utility classes

**Example Structure**:
```css
/* 1. External imports first */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

/* 2. Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 3. CSS custom properties */
@layer base {
  :root {
    --scan-primary-blue: #294199;
    --scan-secondary-orange: #FF9E1E;
    /* ... other variables */
  }
}

/* 4. Global resets and base styles */
@layer base {
  * {
    border-color: var(--border);
    box-sizing: border-box;
  }
  
  html {
    font-family: "Montserrat", "Arial", sans-serif;
    /* ... other base styles */
  }
}
```

### 2. Component Styles (`component.module.css`)
**Purpose**: Component-specific styles that can't be achieved with Tailwind
**Naming Convention**: `component-name.module.css`
**Usage**: CSS Modules for scoped styling

**Example**:
```css
/* button.module.css */
.primaryButton {
  background: linear-gradient(135deg, var(--scan-primary-blue), #1e40af);
  transition: all 0.3s ease;
}

.primaryButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(41, 65, 153, 0.3);
}
```

### 3. Utility Styles (`src/styles/utilities.css`)
**Purpose**: Custom utility classes that extend Tailwind
**Content**:
- Custom animations
- Complex utility classes
- Layout helpers

**Example**:
```css
@layer utilities {
  .text-gradient {
    background: linear-gradient(135deg, var(--scan-primary-blue), var(--scan-secondary-orange));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}
```

### 4. Theme Styles (`src/styles/themes.css`)
**Purpose**: Theme switching and dark mode support
**Content**:
- Dark mode variables
- Theme switching logic
- Color scheme variations

**Example**:
```css
@layer base {
  :root {
    /* Light theme variables */
    --background: #ffffff;
    --foreground: #1f2937;
  }
  
  [data-theme="dark"] {
    /* Dark theme variables */
    --background: #0f172a;
    --foreground: #f8fafc;
  }
}
```

## CSS Import Order (Critical for Functionality)

### 1. Main Entry Point (`src/main.tsx`)
```typescript
import './styles/globals.css'        // Global styles first
import './styles/components.css'     // Component styles second
import './styles/utilities.css'      // Utility styles third
import './styles/themes.css'         // Theme styles last
```

### 2. Component-Level Imports
```typescript
// In component files
import styles from './component.module.css'

// Usage
<div className={`${styles.container} bg-white p-4`}>
  {/* Component content */}
</div>
```

## Tailwind CSS Best Practices

### 1. Configuration (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'scan-primary-blue': '#294199',
        'scan-secondary-orange': '#FF9E1E',
        // Use CSS variables for consistency
        'primary': 'var(--scan-primary-blue)',
        'secondary': 'var(--scan-secondary-orange)',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
```

### 2. PostCSS Configuration (`postcss.config.js`)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## CSS Issues Prevention (Based on ISSUES_AND_FIXES.md)

### 1. Version Compatibility
- ✅ Use Tailwind CSS v3.4.17 (stable)
- ✅ Avoid Tailwind v4 alpha versions
- ✅ Ensure PostCSS and Autoprefixer compatibility

### 2. Import Resolution
- ✅ Never include version numbers in import paths
- ✅ Use proper module resolution paths
- ✅ Avoid relative imports beyond 2 levels

### 3. CSS Loading Order
- ✅ Google Fonts before Tailwind directives
- ✅ CSS variables before component styles
- ✅ Global styles before component styles

### 4. Build Configuration
- ✅ Proper Vite configuration with React plugin
- ✅ PostCSS processing enabled
- ✅ Source maps for development

## Development Workflow

### 1. Adding New Components
```bash
# Create component directory
mkdir src/components/ui/new-component

# Create files
touch src/components/ui/new-component/NewComponent.tsx
touch src/components/ui/new-component/new-component.module.css
touch src/components/ui/new-component/index.ts
```

### 2. Adding Global Styles
```bash
# Add to appropriate CSS file
# - globals.css: Base styles and variables
# - components.css: Global component styles
# - utilities.css: Custom utility classes
# - themes.css: Theme-related styles
```

### 3. Component Styling Priority
1. **First**: Use Tailwind utility classes
2. **Second**: Use CSS custom properties (variables)
3. **Third**: Use component-specific CSS modules
4. **Last**: Use global CSS overrides

## CSS Performance Best Practices

### 1. Minimize CSS Bundle Size
- Use Tailwind's purge/content configuration
- Avoid unused CSS imports
- Use CSS modules for component-specific styles

### 2. Optimize Critical CSS
- Load critical styles inline
- Defer non-critical CSS
- Use CSS-in-JS sparingly

### 3. CSS Caching
- Use content hashing for CSS files
- Implement proper cache headers
- Use CDN for external fonts

## Troubleshooting Common Issues

### 1. Styles Not Loading
```bash
# Check import order in main.tsx
# Verify PostCSS configuration
# Check Tailwind configuration
# Ensure CSS files exist in correct locations
```

### 2. Tailwind Classes Not Working
```bash
# Verify content paths in tailwind.config.js
# Check PostCSS configuration
# Ensure proper build process
# Clear build cache if needed
```

### 3. CSS Variables Not Defined
```bash
# Check CSS variable definitions in globals.css
# Verify import order
# Ensure variables are in :root selector
# Check for typos in variable names
```

## File Naming Conventions

### 1. CSS Files
- Global styles: `globals.css`
- Component styles: `component-name.module.css`
- Utility styles: `utilities.css`
- Theme styles: `themes.css`

### 2. CSS Classes
- Use kebab-case: `.login-card`, `.primary-button`
- Use BEM methodology for complex components
- Prefix custom utilities: `.scan-text-gradient`

### 3. CSS Variables
- Use kebab-case: `--scan-primary-blue`
- Group related variables: `--scan-*` for brand colors
- Use semantic names: `--background`, `--foreground`

## Future Considerations

### 1. CSS-in-JS Alternatives
- Consider styled-components for dynamic styles
- Use CSS modules for component isolation
- Implement CSS custom properties for theming

### 2. Performance Monitoring
- Monitor CSS bundle size
- Track CSS performance metrics
- Implement CSS loading optimization

### 3. Accessibility
- Ensure proper color contrast
- Support reduced motion preferences
- Implement focus indicators

---

## Summary

This CSS organization guide provides a structured approach to managing styles in the Figma-Make frontend. By following these guidelines, you can:

- ✅ Avoid the CSS issues encountered during setup
- ✅ Maintain consistent styling across components
- ✅ Ensure proper CSS loading and processing
- ✅ Scale the application with maintainable styles
- ✅ Follow industry best practices for CSS organization

**Key Principles**:
1. **Separation of Concerns**: Global vs. component-specific styles
2. **Consistency**: Use CSS variables and Tailwind utilities
3. **Maintainability**: Clear file structure and naming conventions
4. **Performance**: Optimize CSS loading and bundle size
5. **Scalability**: Modular approach for future growth

Follow this guide for all future CSS development to maintain consistency and avoid the issues documented in `ISSUES_AND_FIXES.md`. 