# Visual Data Core: App Plugin Development Guide

App plugins in **Visual Data Core** provide a powerful mechanism to introduce full-featured applications or admin tools within the platform. These plugins can register routes, provide custom pages, extend navigation, or introduce new dashboard-level functionality.

---

## 🔍 What is an App Plugin?
An App Plugin is a top-level feature extension. It can render its own pages, provide admin utilities, or even embed tools (like a query builder or configuration interface). Unlike panels or data sources, an App Plugin is not tied to a specific dashboard panel.

---

## 📁 File Structure
Each App Plugin resides in its own directory under `plugins/apps/`:

```
plugins/
└── apps/
    └── my-app-plugin/
        ├── plugin.json
        ├── src/
        │   ├── module.tsx
        │   ├── AppRoot.tsx
        │   └── routes.tsx
        └── README.md
```

---

## 📦 plugin.json (Required)
Defines metadata for the app plugin:

```json
{
  "type": "app",
  "id": "my-app-plugin",
  "name": "My App Plugin",
  "description": "Custom admin or utility page",
  "module": "./src/module.tsx"
}
```

---

## ⚙️ module.tsx (Entry Point)
Registers the plugin with Visual Data Core:

```tsx
import { registerAppPlugin } from 'vdc-core'
import { AppRoot } from './AppRoot'
import { appRoutes } from './routes'

registerAppPlugin({
  id: 'my-app-plugin',
  name: 'My App Plugin',
  rootComponent: AppRoot,
  routes: appRoutes,
})
```

---

## 🧩 AppRoot.tsx
This is the main React component rendered for your app's route:

```tsx
import React from 'react'

export const AppRoot = () => {
  return <div>Welcome to My Custom App</div>
}
```

---

## 🌐 routes.tsx
Defines any additional internal routing:

```tsx
export const appRoutes = [
  {
    path: '/myapp/settings',
    component: () => <div>Settings Page</div>,
  },
]
```

---

## 🧪 Testing Your App Plugin
1. Start your VDC development server.
2. Navigate to `/plugins/my-app-plugin` or use the navigation link if registered.
3. Ensure your components render correctly.

---

## ✅ Registration
The platform automatically loads plugins inside `plugins/apps/` if they contain a valid `plugin.json` and export from `module.tsx`.

---

## 🚀 Example Use Cases
- Admin configuration panels
- Embedded query builders
- AI-powered assistants
- Diagnostic tools
- Custom settings interface

---

## 🧠 Tips for Developers
- Use lazy loading if your app has heavy components.
- Keep routes nested if your app is complex.
- Provide context or Redux slices if global state is needed.

---

For more plugin guides, visit: [https://github.com/hcfk/visual-data-core](https://github.com/hcfk/visual-data-core)