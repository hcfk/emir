# Visual Data Core: Backend Plugin Development Guide

Backend plugins extend the server-side functionality of **Visual Data Core**, allowing you to implement complex integrations, data processing, custom APIs, and AI-assisted tasks.

This guide walks you through creating and registering backend plugins in the platform.

---

## 🔍 What is a Backend Plugin?
A backend plugin is a Node.js module that hooks into the Visual Data Core server runtime. It can expose new endpoints, process background jobs, handle data transformations, and interact with external services.

---

## 📁 File Structure
Each backend plugin lives in the `plugins/backend/` directory:

```
plugins/
└── backend/
    └── my-backend-plugin/
        ├── plugin.json
        ├── index.js
        ├── routes.js (optional)
        ├── tasks.js (optional)
        └── README.md
```

---

## 📦 plugin.json (Required)
Metadata for the plugin:

```json
{
  "type": "backend",
  "id": "my-backend-plugin",
  "name": "My Backend Plugin",
  "description": "Performs data transformations and exposes custom API routes.",
  "entry": "./index.js"
}
```

---

## ⚙️ index.js (Entry Point)
Defines how the plugin registers with the backend:

```js
module.exports = function register(app, { logger, db }) {
  logger.info('Initializing My Backend Plugin')

  // Optional route registration
  app.use('/api/plugins/my-backend-plugin', require('./routes'))

  // Optional job processing
  const tasks = require('./tasks')
  tasks.init(db)
}
```

---

## 🌐 routes.js (Optional API Endpoints)
You can expose custom Express routes:

```js
const express = require('express')
const router = express.Router()

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from My Backend Plugin!' })
})

module.exports = router
```

---

## 🛠️ tasks.js (Optional Background Jobs)
Use this to run scheduled tasks, data syncs, or AI processors:

```js
module.exports.init = (db) => {
  setInterval(() => {
    console.log('Running periodic task...')
    // Custom job logic here
  }, 60000)
}
```

---

## ✅ Registration
Backend plugins are auto-loaded by the Visual Data Core backend if located under `plugins/backend/` and contain a valid `plugin.json`.

---

## 🚀 Example Use Cases
- Custom REST APIs for dashboards
- Scheduled fetchers for third-party APIs
- AI summarization and inference logic
- Data normalization or enrichment services

---

## 🔒 Security Notes
- Always validate and sanitize user input in routes.
- Use API keys or JWTs where needed.
- Avoid blocking the event loop in tasks.

---

## 📚 Resources
- Node.js docs: [https://nodejs.org](https://nodejs.org)
- Express.js: [https://expressjs.com](https://expressjs.com)

For more plugin types and documentation, visit:
👉 [https://github.com/hcfk/visual-data-core](https://github.com/hcfk/visual-data-core)

