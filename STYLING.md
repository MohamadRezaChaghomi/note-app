# Dashboard Styling Documentation

## Overview

This project uses a comprehensive, modern CSS design system built with:
- **CSS Variables** for consistent theming and dark mode support
- **Component-scoped CSS files** for organized, maintainable styles
- **Responsive design** with mobile-first approach
- **Accessibility features** including WCAG 2.1 compliance

## CSS File Structure

```
styles/
├── theme.css              # Global theme variables and reset styles
├── dashboard.css          # Main dashboard layout and components
├── sidebar.css            # Sidebar navigation styling
├── notes-page.css         # Notes list and grid views
├── note-detail.css        # Individual note viewing/editing
├── search-page.css        # Search functionality UI
├── report-page.css        # Analytics and reports
├── editor.css             # Rich text editor
├── auth.css               # Authentication pages (login, register, reset)
├── home.css               # Home page styling
└── ... (other page-specific styles)
```

## Design System

### Colors

**Light Mode:**
- `--bg-primary`: `#ffffff` - Main background
- `--bg-light`: `#f8fafc` - Light background sections
- `--card-bg`: `#ffffff` - Card backgrounds
- `--card-border`: `#e2e8f0` - Subtle borders
- `--text-primary`: `#0f172a` - Main text
- `--text-secondary`: `#475569` - Secondary text
- `--text-light`: `#64748b` - Light/muted text

**Dark Mode:** (Automatically switches via `prefers-color-scheme`)
- All colors automatically invert for comfortable viewing in dark environments

**Brand Colors:**
```css
--color-primary: #3b82f6    /* Blue */
--color-secondary: #8b5cf6  /* Purple */
--color-success: #10b981    /* Green */
--color-warning: #f59e0b    /* Amber */
--color-error: #ef4444      /* Red */
--color-info: #06b6d4       /* Cyan */
```

### Gradients

- `--gradient-primary`: Blue → Purple
- `--gradient-success`: Green → Cyan
- `--gradient-warning`: Amber → Orange
- `--gradient-error`: Red → Dark Red

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Border Radius

```css
--radius-sm: 0.375rem   /* 6px */
--radius-md: 0.5rem     /* 8px */
--radius-lg: 0.75rem    /* 12px */
--radius-xl: 1rem       /* 16px */
--radius-full: 9999px   /* Fully rounded */
```

### Spacing Scale

```css
--spacing-1: 0.25rem    /* 4px */
--spacing-2: 0.5rem     /* 8px */
--spacing-3: 0.75rem    /* 12px */
--spacing-4: 1rem       /* 16px */
--spacing-6: 1.5rem     /* 24px */
--spacing-8: 2rem       /* 32px */
--spacing-10: 2.5rem    /* 40px */
```

## Component Patterns

### Buttons

**Primary Button:**
```html
<button class="editor-button primary">
  <SaveIcon /> Save Note
</button>
```

**Secondary Button:**
```html
<button class="editor-button secondary">
  Cancel
</button>
```

**Danger Button:**
```html
<button class="editor-button danger">
  Delete
</button>
```

### Cards

All card containers use consistent styling:
```css
.card {
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Input Fields

```css
input, textarea, select {
  padding: 0.75rem 1rem;
  background: var(--bg-light);
  border: 1px solid var(--card-border);
  border-radius: 0.75rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  background: var(--bg-lighter);
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Grid Layouts

**2-column grid (responsive):**
```css
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
```

**Auto-fill grid (4 columns on desktop):**
```css
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

## Page Layouts

### Dashboard Layout

**Structure:**
```
dashboard-container
├── dashboard-sidebar (sticky, 280px)
├── dashboard-main
│   ├── dashboard-header (sticky, search bar)
│   └── dashboard-content (main content area)
```

### Notes Page Layout

**Header Section:**
- Title and description
- Action buttons (New Note, View Options)

**Toolbar:**
- Search functionality
- View toggle (grid/list)
- Filter and sort options
- Bulk actions

**Content Area:**
- Grid or list view of notes
- Empty states with CTAs
- Pagination

### Editor Layout

**Structure:**
```
editor-container
├── editor-header (title, save/cancel buttons)
├── formatting-toolbar (text formatting tools)
├── editor-content-area
│   ├── editor-main (rich text input)
│   └── editor-sidebar (tags, properties, settings)
```

## Responsive Design

### Breakpoints

- **Desktop**: 1024px+ (2 columns, full sidebar)
- **Tablet**: 768px - 1023px (Sidebar collapses, content rearranges)
- **Mobile**: < 768px (Single column, mobile-optimized)
- **Small Mobile**: < 640px (Extra optimizations)

### Mobile Optimizations

1. **Sidebar**: Collapses to icon-only or hidden
2. **Navigation**: Hamburger menu on mobile
3. **Grids**: Convert to single column
4. **Modals**: Full-screen on small devices
5. **Touch Targets**: Minimum 44x44px for tap areas

## Dark Mode Support

Dark mode is automatically applied based on system preference:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0f172a;
    --card-bg: #1e293b;
    /* ... other dark mode variables ... */
  }
}
```

All components automatically adapt to dark mode. No additional styling needed!

## Animations

### Predefined Animations

- `fadeIn`: Fade in effect
- `slideInUp`: Slide up from bottom
- `slideInDown`: Slide down from top
- `slideInRight`: Slide in from right
- `slideInLeft`: Slide in from left
- `spin`: Rotating spinner
- `pulse`: Pulsing effect

**Usage:**
```css
.my-element {
  animation: slideInUp 0.3s ease-out;
}
```

### Transition Durations

```css
--duration-fast: 150ms    /* Quick interactions */
--duration-normal: 200ms  /* Standard transitions */
--duration-slow: 300ms    /* Important changes */
--easing: cubic-bezier(0.4, 0, 0.2, 1); /* Consistent easing */
```

## Accessibility Features

### Focus States

All interactive elements have visible focus indicators:
```css
button:focus-visible,
input:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Color Contrast

- Text: WCAG AAA compliant (7:1 contrast ratio)
- Interactive elements: 4.5:1 minimum contrast

### Semantic HTML

- Use proper heading hierarchy (h1, h2, h3)
- Form labels with `<label>` tags
- ARIA labels for icon-only buttons
- Proper alt text for images

### Reduced Motion

Users with `prefers-reduced-motion` preference have animations disabled:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Typography

**Font Stack:**
```css
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
               sans-serif;
--font-mono: 'Fira Code', 'Monaco', 'Courier New', monospace;
```

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

## Common Use Cases

### Status Badge

```html
<span class="status-badge active">Active</span>
<span class="status-badge pending">Pending</span>
<span class="status-badge inactive">Inactive</span>
```

### Tag

```html
<span class="tag-badge">#work</span>
<span class="tag-badge">#personal</span>
```

### Loading State

```html
<div class="loading-spinner"></div>
```

### Empty State

```html
<div class="empty-state">
  <div class="empty-icon">📝</div>
  <h3 class="empty-title">No Notes Yet</h3>
  <p class="empty-message">Start creating your first note</p>
  <button class="empty-action">Create Note</button>
</div>
```

## Best Practices

1. **Use CSS Variables**: Always use CSS variables for colors, spacing, and sizing
2. **Mobile First**: Design for mobile, then enhance for larger screens
3. **Component Reuse**: Create reusable component patterns
4. **Semantic HTML**: Use proper HTML elements for meaning
5. **Performance**: Minimize repaints and reflows
6. **Accessibility**: Test with keyboard navigation and screen readers
7. **Dark Mode**: Ensure all styles work in both light and dark modes

## Customization

To customize the theme:

1. **Edit CSS Variables** in `styles/theme.css`
2. **Update Color Palette** for brand consistency
3. **Adjust Spacing** for different content density
4. **Modify Border Radius** for different visual style
5. **Change Animations** for performance or preference

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

All styles use standard CSS features with fallbacks for older browsers.

## Troubleshooting

### Styles Not Applying

1. Check CSS variable names (case-sensitive)
2. Verify import order in parent component
3. Check for CSS specificity conflicts
4. Clear browser cache and rebuild

### Dark Mode Not Working

- Ensure `prefers-color-scheme` media query is in `theme.css`
- Check system dark mode preference
- Verify all CSS variables have dark mode versions

### Responsive Layout Broken

- Inspect breakpoints (768px, 640px)
- Check grid template changes at breakpoints
- Verify flexbox flex-direction changes
- Test on actual devices, not just browser tools

## Resources

- [CSS Variables Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
