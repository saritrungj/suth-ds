# SUTH Design System Theme Guide

## Theme System Architecture

The design system now uses a **semantic variable approach** for theming. This means:

1. **Primitive variables** define the color palette (e.g., `--primary-600`, `--slate-800`)
2. **Semantic variables** define how colors are used (e.g., `--card-bg`, `--text-primary`)
3. Components use semantic variables, which change based on the active theme

## Theme Modes

### 1. Light Theme (Default)

```css
:root {
  --text-primary: var(--slate-900);
  --bg-body: var(--slate-50);
  --bg-surface: #ffffff;
  /* ... */
}
```

### 2. Dark Theme (System Preference)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: var(--slate-100);
    --bg-body: var(--slate-950);
    --bg-surface: var(--slate-900);
    /* ... */
  }
}
```

### 3. Dark Theme (Manual Override)

```css
[data-theme="dark"] {
  /* Same as system preference */
}
```

## Usage

### Automatic (System Preference)

The theme automatically switches based on user's OS preference:

```css
/* No action needed - automatic */
```

### Manual Toggle

Toggle via JavaScript:

```javascript
// Enable dark mode
document.documentElement.setAttribute("data-theme", "dark");

// Enable light mode
document.documentElement.setAttribute("data-theme", "light");

// Remove override (back to system preference)
document.documentElement.removeAttribute("data-theme");
```

### Persist Theme

```javascript
// Save preference
localStorage.setItem("theme", "dark");

// Load preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}
```

## Semantic Variables Reference

### Text Colors

| Variable           | Light     | Dark      |
| ------------------ | --------- | --------- |
| `--text-primary`   | Slate 900 | Slate 100 |
| `--text-secondary` | Slate 600 | Slate 400 |
| `--text-muted`     | Slate 500 | Slate 500 |
| `--text-inverse`   | White     | Slate 900 |

### Background Colors

| Variable        | Light     | Dark      |
| --------------- | --------- | --------- |
| `--bg-body`     | Slate 50  | Slate 950 |
| `--bg-surface`  | White     | Slate 900 |
| `--bg-elevated` | White     | Slate 800 |
| `--bg-sunken`   | Slate 100 | Slate 950 |

### Component Variables

| Variable            | Light     | Dark      |
| ------------------- | --------- | --------- |
| `--card-bg`         | White     | Slate 900 |
| `--card-border`     | Slate 200 | Slate 700 |
| `--input-bg`        | White     | Slate 900 |
| `--input-border`    | Slate 300 | Slate 600 |
| `--sidebar-bg`      | White     | Slate 900 |
| `--navbar-bg`       | White     | Slate 900 |
| `--modal-bg`        | White     | Slate 900 |
| `--table-header-bg` | Slate 50  | Slate 800 |

## Components Updated

All components now use semantic variables:

- ✅ **Buttons** - Primary, success, danger, etc.
- ✅ **Cards** - Background, border, header, footer
- ✅ **Forms** - Inputs, selects, textareas, checkboxes, switches
- ✅ **Navigation** - Navbar, sidebar, links
- ✅ **Tables** - Headers, rows, borders, striped
- ✅ **Modals** - Background, header, footer
- ✅ **Dropdowns** - Background, items, hover states
- ✅ **Accordions** - Background, header, borders
- ✅ **Tabs** - Active, hover states
- ✅ **Timelines** - Content, dots
- ✅ **List Groups** - Background, hover
- ✅ **Pagination** - Buttons, active state
- ✅ **Badges** - Soft variants, outline variants
- ✅ **Alerts** - All color variants
- ✅ **Code/Pre** - Background, text color
- ✅ **Avatars** - Status indicators

## Customizing Themes

### Override Specific Variables

```css
:root {
  /* Custom primary color */
  --primary-600: #0066cc;

  /* Custom card background in light mode */
  --card-bg: #fafafa;
}

[data-theme="dark"] {
  /* Custom card background in dark mode */
  --card-bg: #1a1a2e;
}
```

### Adding a Custom Theme

```css
[data-theme="custom"] {
  --text-primary: #333333;
  --bg-body: #f5f5f5;
  --card-bg: #ffffff;
  /* ... */
}
```

## Testing Themes

### Check Current Theme

```javascript
// Check if dark mode is active
const isDark =
  document.documentElement.getAttribute("data-theme") === "dark" ||
  (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches);
```

### Listen for System Theme Changes

```javascript
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    console.log("Dark mode:", e.matches);
  });
```

## Migration Notes

### Old Variable Names (Still Supported)

| Old              | New                      |
| ---------------- | ------------------------ |
| `--bg-primary`   | `--bg-surface`           |
| `--bg-secondary` | `--bg-body`              |
| `--border-color` | `--color-border-default` |

### Deprecated

- Hardcoded color values in components
- Component-specific dark mode overrides (replaced by semantic variables)
