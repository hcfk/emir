# Visual Data Core Configuration Guide

This guide explains how to configure the Visual Data Core (VDC) platform. The configuration system supports environment variables, a default configuration file, and override options for deployment customization.

---

## 📁 Configuration File Location

Visual Data Core looks for a `config.js` or `config.json` file in the root `server/` directory.

Example:
```
visual-data-core/
├── client/
├── server/
│   └── config.js
```

---

## 🔧 `config.js` Structure

```js
module.exports = {
  server: {
    port: process.env.PORT || 5000,
    baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  },

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vdc',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    tokenExpiration: '1d',
  },

  logging: {
    level: 'info',
    directory: './logs',
  },

  plugins: {
    autoLoad: true,
    folder: './plugins',
  },

  features: {
    enableAI: true,
    enableAuditLogs: true,
  },
}
```

---

## 🌱 Environment Variables

Override any config value using environment variables.

Common variables:
```
PORT=8080
MONGODB_URI=mongodb://yourdb:27017/vdc
JWT_SECRET=mycustomjwtsecret
BASE_URL=https://vdc.example.com
```

Store these in a `.env` file and use a loader like `dotenv` in your entry script.

---

## 📦 Plugin Configuration

Plugins may also include their own config under:
```
/plugins/<type>/<plugin-id>/config.js
```

These configs can be accessed by the core plugin manager and passed to the plugin during initialization.

---

## 🔐 Security Best Practices

- Never commit `.env` files to version control.
- Set strong secrets for `JWT_SECRET` and external API keys.
- Always validate and sanitize config inputs.

---

## 🛠 Example Custom `.env`
```
PORT=443
MONGODB_URI=mongodb+srv://admin:pass@cluster.mongodb.net/vdc
JWT_SECRET=s3cr3t
BASE_URL=https://visualdatacore.com
```

---

## ✅ Summary
- `config.js` holds all runtime configuration
- Use `.env` and `process.env` to override safely
- Plugins can define per-plugin configuration
- Keep secrets out of version control

Visual Data Core is built to be easily configurable for local development or production deployment.

