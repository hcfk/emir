# Visual Data Core Plugin Structure

The Visual Data Core (VDC) platform follows a modular architecture with a powerful plugin system. All plugins are organized by type, enabling developers to easily extend the platform with new functionality.

This guide outlines the recommended file and folder structure for plugins in VDC, including required files, naming conventions, and directory layout.

---

## 📁 Folder Layout

All plugins are located under the `/plugins` directory:

```
/plugins
├── apps/                # Application-level plugins
├── panels/              # Custom visualization panel plugins
├── data-sources/        # Data source connectors (e.g. InfluxDB, MySQL)
├── extensions/          # UI extensions (menus, overlays, editors)
├── ai/                  # AI-powered plugins (e.g. summaries, LLMs)
└── <future-types>/      # Future plugin types (e.g. alerting, storage, analytics)
```

Each subdirectory contains one or more plugins. Each plugin has a folder named after its `id`.

---

## 📦 Required Files for All Plugins

Each plugin **must** include at least the following:

### `plugin.json`
Metadata descriptor file:

```json
{
  "type": "panel",           // Type: app, panel, data-source, extension, ai
  "id": "my-bar-chart",      // Unique plugin ID
  "name": "Bar Chart",        // Human-readable name
  "description": "Custom bar chart panel.",
  "entry": "./module.ts"      // Main file path (relative to plugin root)
}
```

### `module.ts` or `index.js`
The entrypoint script used for registration, typically includes the logic to integrate with the platform.

```ts
import { registerPanel } from 'vdc-core/panels'

registerPanel({
  id: 'my-bar-chart',
  name: 'Bar Chart',
  component: () => import('./BarChart'),
})
```

---

## 📁 Optional Recommended Files

- `README.md`: Plugin-level documentation
- `ui/`: UI components (React-based)
- `model.ts` or `logic.js`: Core plugin logic
- `assets/`: SVGs, thumbnails, or data samples
- `tests/`: Unit or integration tests

---

## 🧠 Plugin Naming Guidelines

- Use **kebab-case** for plugin folders and IDs (e.g., `influxdb-source`, `smart-insights`)
- Avoid generic names: prefer `my-org-bar-chart` over `chart`
- Ensure uniqueness across plugin types

---

## ✅ Plugin Discovery & Auto-registration

During platform startup, all plugins in `/plugins/*/` are scanned. If a plugin has a valid `plugin.json` and a working entry file, it's automatically registered.

Custom plugin types can define their own handlers in the plugin loader pipeline.

---

## 🚀 Summary
- Use `/plugins/<type>/<plugin-id>/` format
- Include a `plugin.json` and entry script
- Optionally structure your plugin with UI, logic, assets, and docs
- Follow naming conventions for compatibility and discoverability

---

The plugin system is what makes Visual Data Core powerful and adaptable.
Get started by cloning a sample plugin from our `/examples` folder or documentation!

