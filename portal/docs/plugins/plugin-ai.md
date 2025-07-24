# Visual Data Core: AI Plugin Development Guide

AI plugins supercharge the Visual Data Core platform with artificial intelligence capabilities. These plugins help analyze, summarize, and interpret data using machine learning models, large language models, or AI-enhanced services.

---

## 🤖 What is an AI Plugin?
An AI plugin allows you to integrate smart logic such as:

- LLM-based chart summarization
- Data-driven predictions and trend analysis
- Natural Language Query (NLQ) support
- Anomaly detection and alerting
- AI-enhanced insights or automation

It may involve both backend computation and optional frontend integration.

---

## 📁 File Structure
AI plugins live under the `plugins/ai/` directory:

```
plugins/
└── ai/
    └── smart-insights-plugin/
        ├── plugin.json
        ├── index.js
        ├── model.js (or openai.js, llama.js, etc.)
        ├── ui/ (optional React components)
        └── README.md
```

---

## 📦 plugin.json (Required)
Defines the plugin's metadata:

```json
{
  "type": "ai",
  "id": "smart-insights-plugin",
  "name": "Smart Insights Plugin",
  "description": "Provides AI-generated summaries and insights for charts.",
  "entry": "./index.js"
}
```

---

## ⚙️ index.js (Plugin Entrypoint)
This file registers the plugin in the platform:

```js
module.exports = function register(app, { logger, aiClient }) {
  logger.info('Smart Insights Plugin loaded.')

  app.post('/api/plugins/smart-insights/generate', async (req, res) => {
    const { query, data } = req.body
    const result = await require('./model').summarize(query, data)
    res.json(result)
  })
}
```

---

## 🔮 model.js (AI logic)
Contains logic for calling your LLMs or models:

```js
const openai = require('../../lib/openai')

exports.summarize = async (query, data) => {
  const prompt = `Summarize the following data for query: ${query}`
  const response = await openai.chat(prompt, data)
  return { summary: response.text }
}
```

---

## 📈 ui/ (optional frontend views)
Optional folder for React-based widgets:

```
ui/
├── InsightPanel.jsx
└── ResultCard.jsx
```

These components can be dynamically loaded into dashboards.

---

## ✅ Registration
All plugins in `plugins/ai/` with a valid `plugin.json` and entry file are auto-registered during platform startup.

---

## 🚀 Example Use Cases
- Automatic dashboard summaries
- Trend and forecast generation
- Outlier detection in real-time data
- ChatGPT/NLQ chart explanations

---

## 🔒 Security and API Keys
- Store API keys in `.env` files and never hardcode.
- Use server-side logic for calling third-party AI providers.
- Log usage for traceability.

---

## 📖 Resources
- OpenAI SDK: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- HuggingFace Inference: [https://huggingface.co/inference-api](https://huggingface.co/inference-api)
- Node.js AI libs: `langchain`, `transformers.js`, `replicate`, etc.

---

Visual Data Core empowers developers