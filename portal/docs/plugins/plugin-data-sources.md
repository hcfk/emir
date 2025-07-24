# Visual Data Core Plugin Guide: Data Source Plugins

## Introduction

Data Source Plugins in Visual Data Core are modular connectors that allow you to fetch, query, and visualize data from external systems such as time-series databases, REST APIs, AI endpoints, and more. Each data source plugin is isolated, fully configurable, and designed to seamlessly integrate with the Visual Data Core dashboard and query engine.

---

## 📁 Directory Structure

Every data source plugin must reside inside the `plugins/data-sources/` directory. Here's the minimum required file structure:

```
plugins/
└── data-sources/
    └── your-plugin-name/
        ├── plugin.json          # Plugin metadata and definition
        ├── src/
        │   ├── module.ts        # Entry point for the plugin logic
        │   ├── QueryEditor.tsx  # React-based query editor (optional)
        │   ├── config.ts        # Configuration schema and form
        │   └── types.ts         # Type definitions
        └── README.md            # Plugin-specific documentation
```

---

## 📦 plugin.json Example

```json
{
  "type": "datasource",
  "id": "influxdb",
  "name": "InfluxDB Connector",
  "description": "Query and visualize time-series data from InfluxDB.",
  "module": "./src/module.ts",
  "config": {
    "options": [
      { "id": "url", "type": "string", "label": "Database URL" },
      { "id": "token", "type": "string", "label": "Auth Token", "secure": true }
    ]
  }
}
```

---

## 🧠 module.ts - Plugin Entry

```ts
import { DataSourcePlugin } from 'vdc-core/types'
import { queryInfluxDB } from './services/query'

export const plugin: DataSourcePlugin = {
  id: 'influxdb',
  name: 'InfluxDB',

  testConnection: async (config) => {
    const response = await fetch(`${config.url}/ping`, {
      headers: { Authorization: `Token ${config.token}` },
    })
    return response.ok
  },

  query: async (queryParams, config) => {
    return queryInfluxDB(queryParams, config)
  },
}
```

---

## ⚙️ Configuration Options

Plugins support various field types:

- `string`, `number`, `boolean`
- `secure` (e.g. for tokens, passwords)
- `select` (with `options`)
- `textarea`

---

## 🧪 Testing & Validation

Each plugin should implement:

- `testConnection()` method
- Basic validation rules (e.g., required fields)
- Sample query with mock data for preview/testing

---

## 🧑‍💻 UI: QueryEditor.tsx (Optional)

You can define a custom query editor using React:

```tsx
const QueryEditor = ({ query, onChange }) => {
  return (
    <div>
      <label>Bucket:</label>
      <input value={query.bucket} onChange={(e) => onChange({ ...query, bucket: e.target.value })} />
    </div>
  )
}
```

This will appear inside the panel configuration when this data source is selected.

---

## 🚀 Deployment

1. Place your plugin in `plugins/data-sources/`
2. Restart the backend to auto-load it
3. Navigate to **Data Sources > Add New** in the UI
4. Select your plugin from the list and configure

---

## 📢 Contribution Tips

- Keep logic in small, testable functions
- Reuse shared types/utilities from `vdc-core`
- Document supported query syntax in the plugin README

---

## ✅ Example Plugins to Learn From

- InfluxDB Connector
- HTTP/REST API Fetcher
- OpenAI Completion API Plugin

---

For more details, check out the full project: [https://github.com/hcfk/visual-data-core](https://github.com/hcfk/visual-data-core)

> Happy hacking, and welcome to the Visual Data Core plugin ecosystem!

