# Quick Styling Reference

## Color System

### Using Colors in Components

```jsx
// Primary action
<button style={{ background: 'var(--color-primary)' }}>
  Click me
</button>

// Secondary action
<div style={{ background: 'var(--gradient-primary)' }}>
  Gradient background
</div>

// Error message
<p style={{ color: 'var(--color-error)' }}>
  Something went wrong
</p>
```

### CSS Classes for Common Colors

```css
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-light { color: var(--text-light); }
.bg-light { background: var(--bg-light); }
.bg-lighter { background: var(--bg-lighter); }
```

## Common Component Styles

### Button Examples

```css
/* Primary Button */
.btn-primary {
  padding: var(--spacing-3) var(--spacing-5);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-normal) var(--easing);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Secondary Button */
.btn-secondary {
  padding: var(--spacing-3) var(--spacing-5);
  background: var(--bg-light);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-normal) var(--easing);
}

.btn-secondary:hover {
  background: var(--bg-lighter);
  border-color: var(--color-primary);
}
```

### Card Examples

```css
/* Basic Card */
.card {
  padding: var(--spacing-6);
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-xl);
  transition: all var(--duration-normal) var(--easing);
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: translateY(-4px);
}

/* Elevated Card */
.card.elevated {
  box-shadow: var(--shadow-lg);
}
```

### Form Input Examples

```css
/* Text Input */
input[type="text"],
input[type="email"],
textarea {
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--bg-light);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: all var(--duration-fast) var(--easing);
}

input:focus,
textarea:focus {
  outline: none;
  background: var(--bg-lighter);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Select Dropdown */
select {
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--bg-light);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

## Layout Helpers

### Flexbox Utilities

```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.gap-2 { gap: var(--spacing-4); }
.gap-4 { gap: var(--spacing-8); }
```

### Spacing Helpers

```css
.p-1 { padding: var(--spacing-2); }
.p-2 { padding: var(--spacing-4); }
.p-3 { padding: var(--spacing-6); }
.p-4 { padding: var(--spacing-8); }
.m-0 { margin: 0; }
.m-auto { margin: auto; }
```

### Responsive Grid

```css
/* 2-column grid */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6);
}

@media (max-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

/* Auto-fill responsive */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}
```

## Text Utilities

```css
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.font-600 { font-weight: 600; }
.font-700 { font-weight: 700; }
.font-800 { font-weight: 800; }
```

## Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  background: var(--bg-light);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
}

.badge.success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.badge.warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.badge.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.badge.info {
  background: rgba(6, 182, 212, 0.1);
  color: var(--color-info);
}
```

## Tags

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
}

.tag .remove-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.8;
  padding: 0;
}

.tag .remove-btn:hover {
  opacity: 1;
}
```

## Icons + Text Patterns

```css
/* Icon with label */
.icon-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.icon-label .icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Icon button */
.icon-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.icon-btn:hover {
  background: var(--bg-lighter);
  color: var(--color-primary);
}
```

## Loading & Empty States

```css
/* Loading spinner */
.loader {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--card-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Empty state container */
.empty-state {
  text-align: center;
  padding: var(--spacing-12);
  background: var(--card-bg);
  border: 1px dashed var(--card-border);
  border-radius: var(--radius-xl);
}

.empty-state .icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
  border-radius: var(--radius-lg);
  color: var(--text-light);
  font-size: 2rem;
}

.empty-state h3 {
  margin-bottom: var(--spacing-2);
  color: var(--text-primary);
}

.empty-state p {
  margin-bottom: var(--spacing-4);
  color: var(--text-light);
}
```

## Modal & Dialog Patterns

```css
/* Modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

/* Modal content */
.modal {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-2xl);
  animation: slideInUp 0.3s var(--easing);
}

.modal-header {
  margin-bottom: var(--spacing-6);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--card-border);
}
```

## Tips for Component Development

### 1. Always Use Variables
```css
/* ✅ Good */
.button {
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal);
}

/* ❌ Avoid */
.button {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}
```

### 2. Plan for Dark Mode
```css
/* ✅ Good - automatically adapts to dark mode */
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
}

/* ❌ Avoid - hardcoded colors */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #0f172a;
}
```

### 3. Use Responsive Utilities
```css
/* ✅ Good */
@media (max-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

/* ❌ Avoid */
.grid-2 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 4. Focus States for Accessibility
```css
/* ✅ Good */
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ❌ Avoid */
button:focus {
  outline: none;
}
```

## Common Issues & Solutions

### Issue: Colors look different in dark mode
**Solution**: Always use CSS variables instead of hardcoded colors

### Issue: Component too wide on mobile
**Solution**: Use max-width and responsive grids
```css
.component {
  max-width: 100%;
  padding: var(--spacing-4);
}
```

### Issue: Text too small on mobile
**Solution**: Use media queries to increase font size
```css
@media (max-width: 640px) {
  h2 {
    font-size: 1.25rem;
  }
}
```

### Issue: Animations causing layout shifts
**Solution**: Use `transform` instead of changing `width`/`height`
```css
/* ✅ Good */
button:hover {
  transform: translateY(-2px);
}

/* ❌ Avoid */
button:hover {
  padding: 0.75rem 1rem;
  padding-top: 0.5rem;
}
```

## Resources

- View the complete design system in `styles/theme.css`
- See examples in individual page CSS files
- Check `STYLING.md` for comprehensive documentation
- Review component examples in React files

---

Need more help? Check the full documentation at `STYLING.md` 📚
