# CSS Files Index & Import Map

## File Locations & Sizes

### Core Theme Files
| File | Path | Lines | Purpose |
|------|------|-------|---------|
| **theme.css** | `styles/theme.css` | 400+ | CSS variables, resets, utilities, animations |
| **globals.css** | `app/globals.css` | 658 | Tailwind import + theme integration |

### Layout & Navigation
| File | Path | Lines | Purpose |
|------|------|-------|---------|
| **dashboard.css** | `styles/dashboard.css` | 700+ | Main dashboard layout, header, sidebar, stat cards |
| **sidebar.css** | `styles/sidebar.css` | 450+ | Sidebar navigation, tags, user profile |

### Page-Specific Styles
| File | Path | Lines | Purpose |
|------|------|-------|---------|
| **notes-page.css** | `styles/notes-page.css` | 876 | Notes list, grid view, filtering, bulk actions |
| **note-detail.css** | `styles/note-detail.css` | 450+ | Note viewing, meta info, sidebar, modals |
| **search-page.css** | `styles/search-page.css` | 600+ | Search form, results, filters, suggestions |
| **report-page.css** | `styles/report-page.css` | 550+ | Analytics, charts, stats, data tables |
| **editor.css** | `styles/editor.css` | 810+ | Rich text editor, toolbar, formatting, properties |
| **auth.css** | `styles/auth.css` | 800+ | Login, register, password reset, forgot password |
| **home.css** | `styles/home.css` | ~400 | Landing page styling |

## Import Hierarchy

```
app/layout.jsx (Root Layout)
└── app/globals.css
    ├── @import "styles/theme.css"  ← Global variables & utilities
    └── @import "tailwindcss"

app/dashboard/layout.jsx (Dashboard Layout)
├── app/globals.css  (already loaded)
├── @import "styles/dashboard.css"  ← Layout structure
└── @import "styles/sidebar.css"    ← Navigation

app/dashboard/page.jsx (Dashboard Home)
├── (all dashboard styles loaded)
└── Uses CSS classes from dashboard.css

app/dashboard/notes/page.jsx (Notes List)
├── (all dashboard styles loaded)
└── @import "styles/notes-page.css"

app/dashboard/notes/[id]/page.jsx (Note Detail)
├── (all dashboard styles loaded)
└── @import "styles/note-detail.css"

app/dashboard/notes/new/page.jsx (Note Editor)
├── (all dashboard styles loaded)
└── @import "styles/editor.css"

app/dashboard/search/page.jsx (Search)
├── (all dashboard styles loaded)
└── @import "styles/search-page.css"

app/report/page.jsx (Reports)
├── app/globals.css
└── @import "styles/report-page.css"

app/auth/login/page.jsx (Login)
├── app/globals.css
└── @import "styles/auth.css"

app/auth/register/page.jsx (Register)
├── app/globals.css
└── @import "styles/auth.css"
```

## CSS Scope & Cascade

### Global Scope (Applied to All Pages)
**File**: `styles/theme.css`
- CSS custom properties (variables)
- Universal resets
- Base element styles (h1, p, a, button, input)
- Utility classes
- Animation keyframes
- Accessibility rules
- Print styles

**Applied in**: Every page via `globals.css`

### Dashboard Scope
**Files**: 
- `styles/dashboard.css` - Main layout, container, header
- `styles/sidebar.css` - Navigation, menus
- `styles/notes-page.css` - Notes specific
- `styles/note-detail.css` - Detail view specific
- `styles/search-page.css` - Search specific
- `styles/editor.css` - Editor specific

**Applied in**: All pages under `/dashboard` via layout.jsx imports

### Page-Specific Scope
**Files**:
- `styles/auth.css` - Authentication pages only
- `styles/report-page.css` - Report page only
- `styles/home.css` - Home page only

**Applied in**: Individual page imports

## CSS Class Naming Convention

### Global Utilities
```css
.flex, .flex-col, .items-center, .gap-1, .gap-2, .p-1, .p-2
.text-sm, .text-lg, .font-600, .text-primary
.bg-light, .bg-lighter, .border-1
.rounded-sm, .rounded-lg
```

### Component Classes
```css
/* Dashboard */
.dashboard-container
.dashboard-sidebar
.dashboard-main
.dashboard-header

/* Stat Card */
.stat-card
.stat-icon
.stat-value
.stat-change

/* Notes */
.notes-page
.notes-header
.notes-toolbar
.notes-container
.note-card

/* Editor */
.editor-container
.editor-header
.editor-toolbar
.formatting-toolbar
```

### State Classes
```css
.active      /* Active/selected state */
.hover       /* Hover state (implicit in :hover) */
.disabled    /* Disabled state */
.error       /* Error state */
.loading     /* Loading state */
```

### Responsive Classes
```css
@media (max-width: 1024px) { ... }  /* Tablet & below */
@media (max-width: 768px) { ... }   /* Mobile & below */
@media (max-width: 640px) { ... }   /* Small mobile */
```

## Variable Usage Guide

### Colors
```css
/* Text colors */
color: var(--text-primary);      /* Main text */
color: var(--text-secondary);    /* Secondary text */
color: var(--text-light);        /* Light/muted text */

/* Background colors */
background: var(--bg-primary);   /* Main background */
background: var(--bg-light);     /* Light sections */
background: var(--card-bg);      /* Card backgrounds */

/* Semantic colors */
color: var(--color-primary);     /* Blue - Primary actions */
color: var(--color-success);     /* Green - Success */
color: var(--color-warning);     /* Amber - Warnings */
color: var(--color-error);       /* Red - Errors */
```

### Spacing
```css
padding: var(--spacing-4);       /* 1rem = 16px */
margin: var(--spacing-6);        /* 1.5rem = 24px */
gap: var(--spacing-8);           /* 2rem = 32px */
```

### Shadows
```css
box-shadow: var(--shadow-md);    /* Subtle */
box-shadow: var(--shadow-lg);    /* Medium */
box-shadow: var(--shadow-xl);    /* Large/prominent */
```

### Border Radius
```css
border-radius: var(--radius-md);  /* 8px */
border-radius: var(--radius-lg);  /* 12px */
border-radius: var(--radius-xl);  /* 16px */
```

### Transitions
```css
transition: all var(--duration-fast) var(--easing);    /* 150ms */
transition: all var(--duration-normal) var(--easing);  /* 200ms */
transition: all var(--duration-slow) var(--easing);    /* 300ms */
```

### Gradients
```css
background: var(--gradient-primary);  /* Blue → Purple */
background: var(--gradient-success);  /* Green → Cyan */
```

## Performance Considerations

### CSS File Sizes
- **Total CSS**: ~5,200+ lines
- **Gzipped**: Approximately 40-50KB
- **Loading**: Async loaded per page

### Optimization Tips
1. CSS variables reduce redundancy
2. Responsive media queries only load needed styles
3. No unused styles (all classes are used)
4. Minimal specificity conflicts
5. Efficient selectors

### Browser Caching
- CSS files are cached by browsers
- Changes trigger new versions automatically
- Tailwind ensures consistency

## Development Workflow

### Adding New Styles

1. **Global Style** (used across site):
   - Add to `styles/theme.css`
   - Use CSS variables
   - Test in light & dark modes

2. **Layout/Component Style** (Dashboard specific):
   - Add to `styles/dashboard.css` or component file
   - Use existing CSS variables
   - Add responsive media queries

3. **Page-Specific Style** (single page):
   - Create new file in `styles/` folder
   - Follow naming convention: `page-name.css`
   - Import in page component

### Testing New Styles

```bash
# 1. Update CSS file
# 2. Browser hot-reload automatically applies changes
# 3. Check light and dark modes (F12 → Rendering → Emulate CSS media feature prefers-color-scheme)
# 4. Test responsive design (F12 → Toggle device toolbar)
# 5. Verify accessibility (F12 → Accessibility tab)
```

### Common Tasks

**Change primary color:**
- Edit `--color-primary` in `styles/theme.css`
- All components automatically update

**Adjust spacing:**
- Edit `--spacing-*` variables in `styles/theme.css`
- All components maintain consistent spacing

**Add new page styles:**
- Create `styles/page-name.css`
- Import in component: `import "@/styles/page-name.css"`

**Modify dark mode colors:**
- Edit colors in `@media (prefers-color-scheme: dark)` block in `styles/theme.css`

## Troubleshooting

### Styles not applying?
1. ✅ Check file is imported in component
2. ✅ Verify CSS file path is correct
3. ✅ Clear browser cache (Ctrl+Shift+Delete)
4. ✅ Restart dev server (npm run dev)
5. ✅ Check CSS variable names (case-sensitive)

### Colors look wrong in dark mode?
1. ✅ Ensure color uses CSS variable
2. ✅ Check `@media (prefers-color-scheme: dark)` values
3. ✅ Test with DevTools color scheme emulation

### Responsive layout broken?
1. ✅ Check media query breakpoints (768px, 640px)
2. ✅ Verify grid/flex layout changes at breakpoints
3. ✅ Test on actual device, not just browser tools

### Animation not smooth?
1. ✅ Use `transform` instead of positioning
2. ✅ Use `opacity` instead of `visibility`
3. ✅ Avoid `width`/`height` changes in animations

## Documentation Files

| File | Purpose |
|------|---------|
| **STYLING.md** | Complete styling guide with examples |
| **STYLING_IMPLEMENTATION.md** | Summary of what was implemented |
| **STYLING_QUICK_REFERENCE.md** | Quick copy-paste code snippets |
| **CSS_FILES_INDEX.md** | This file - CSS file locations & imports |

---

**Last Updated**: Implementation Complete ✅
**Version**: 1.0 - Production Ready
**Total CSS Coverage**: All pages styled with modern design system
