# Visual Data Core: Panel Plugin Development Guide

Panel plugins are core components in **Visual Data Core**, responsible for rendering visualizations such as charts, tables, and status indicators on dashboards.

This guide will help you understand how to create, configure, and integrate your own custom panel plugins.

---

## 🔍 What is a Panel Plugin?
A panel plugin is a frontend module that displays data visually using libraries like Chart.js, Recharts, or ECharts. It supports configuration via an editor and works with any compatible data source.

---

## 📁 File Structure
Each panel plugin resides in its own directory under `plugins/panels/`:

```
plugins/
└── panels/
    └── my-panel-plugin/
        ├── plugin.json
        ├── src/
        │   ├── module.tsx
        │   ├── Panel.tsx
        │   └── PanelEditor.tsx
        └── README.md
```

---

## 📦 plugin.json (Required)
Describes metadata about the plugin:

```json
{
  "type": "panel",
  "id": "my-panel-plugin",
  "name": "My Panel Plugin",
  "description": "Custom chart panel for data visualization",
  "module": "./src/module.tsx"
}
```

---

## ⚙️ module.tsx (Entry Point)
Registers the panel with Visual Data Core:

```tsx
import { registerPanelPlugin } from 'vdc-core'
import { MyPanel } from './Panel'
import { MyPanelEditor } from './PanelEditor'

registerPanelPlugin({
  id: 'my-panel-plugin',
  name: 'My Panel Plugin',
  component: MyPanel,
  editor: MyPanelEditor,
})
```

---

## 📊 Panel.tsx (Renderer)
Defines how the panel visualizes data:

```tsx
import React from 'react'

export const MyPanel = ({ data, options }) => {
  return (
    <div>
      <h4>{options.title}</h4>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

---

## 🧩 PanelEditor.tsx (Optional UI Editor)
Provides configuration UI in the dashboard builder:

```tsx
import React from 'react'

export const MyPanelEditor = ({ options, onChange }) => {
  return (
    <div>
      <label>Title:</label>
      <input
        value={options.title || ''}
        onChange={(e) => onChange({ ...options, title: e.target.value })}
      />
    </div>
  )
}
```

---

## ✅ Registration in the Platform
Panel plugins are auto-discovered from the `plugins/panels/` folder. Make sure your plugin has a valid `plugin.json` and export from `module.tsx`.

---

## 🧪 Testing Your Panel
1. Start your VDC frontend dev server.
2. Navigate to a dashboard and add a new panel.
3. Select your custom panel plugin from the panel type dropdown.
4. Configure it using the editor.

---

## 💡 Best Practices
- Keep components small and modular.
- Support theming (dark/light mode).
- Validate data structures gracefully.
- Optimize rendering for performance.

---

## 🚀 Example Use Cases
- Line chart for time series data
- Real-time status indicators
- KPI/Stat boxes
- Interactive data tables

---

For more plugin types and guides, visit: [https://github.com/hcfk/visual-data-core](https://github.com/hcfk/visual-data-core)

