# Software Design Document (SDD) for Visual Data Core

## 1. Introduction

### 1.1 Project Overview
**Visual Data Core** is an open-source, modular, data dashboard platform. It is built with React, Vite, Node.js, and MongoDB. The system is designed to visualize real-time and historical data from various sources via a plugin architecture. Developers can extend its functionality by writing their own plugins.

### 1.2 Purpose
This document provides a comprehensive overview of the architecture, design, and components of the Visual Data Core system. It is intended for developers, architects, and contributors who are working on or want to understand the platform.

### 1.3 Target Audience
- Core developers
- Plugin developers
- System integrators
- Technical stakeholders

---

## 2. System Objectives
- Deliver a modern, customizable dashboard experience
- Support real-time and historical data from multiple sources
- Provide a plugin-first approach for extensibility
- Enable fine-grained, project-based permission and access control
- Maintain developer-friendliness with clean architecture and open standards

---

## 3. Architecture Overview

### 3.1 High-Level Design
- **Frontend:** React + Vite + CoreUI
- **Backend:** Node.js + Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT-based
- **Authorization:** CASL with role & project-based access
- **Plugin System:** App, Data Source, Panel, UI Extension, AI

### 3.2 Architectural Diagram
*(To be inserted: A visual diagram showing frontend, backend, DB, and plugin communication)*

---

## 4. Frontend Design

### 4.1 Tech Stack
- React 18+
- Vite (bundler)
- CoreUI (UI library)
- Redux Toolkit (state management)
- Axios (HTTP client)

### 4.2 Key Features
- Modular component-based structure
- Role and permission-based navigation
- Dashboard and panel system
- Real-time UI updates

### 4.3 Folder Structure
See `docs/project-structure.md` for detailed breakdown.

---

## 5. Backend Design

### 5.1 Tech Stack
- Node.js (runtime)
- Express (framework)
- MongoDB (data storage)
- Mongoose (ORM)
- Winston (logging)
- Bcrypt (password hashing)
- dotenv (configuration)

### 5.2 API Design
RESTful APIs organized into:
- Auth
- Users
- Projects
- Plugins

### 5.3 Middleware
- `authMiddleware` for JWT verification
- `validationMiddleware` for input checks
- Logging middleware with Winston

---

## 6. Plugin System

### 6.1 Supported Plugin Types
- App Plugins
- Data Source Plugins
- Panel Plugins
- UI Extensions
- AI Plugins

### 6.2 Plugin Structure
Each plugin requires:
- `plugin.json` (metadata)
- `src/module.ts` (entry point)

See full documentation in `docs/plugins/*.md`

### 6.3 Developer Guide
Plugins reside under `/plugins`. Refer to individual plugin guides:
- `docs/plugins/data-source.md`
- `docs/plugins/panel.md`
- `docs/plugins/ai.md`

---

## 7. Database Models

### 7.1 User
```js
{
  username: String,
  email: String,
  password: String,
  role: 'admin' | 'contentadmin' | 'normal',
  isActive: Boolean
}
```

### 7.2 Project
```js
{
  name: String,
  description: String,
  creator: ObjectId,
  members: [
    { userId: ObjectId, role: 'projectadmin' | 'projectuser' }
  ],
  subProjects: [ { name, description } ]
}
```

---

## 8. Authentication & Authorization

### 8.1 JWT Strategy
- Authenticated via token on login
- Token includes: id, role, isActive

### 8.2 Roles
- Super Admin
- Admin
- Project Admin
- Project User

### 8.3 Authorization
Implemented using **CASL** for:
- Global and project-based access rules
- Frontend + Backend enforcement

---

## 9. Configuration & Environment

### 9.1 `.env` Variables
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vdc
JWT_SECRET=secretkey
```

### 9.2 Config Management
- Central config file in `/config`
- Shared between services when needed

---

## 10. Deployment

### 10.1 Local Development
- Run backend with `nodemon`
- Start frontend with `vite`

### 10.2 Hosting Options
- Cloud VM (e.g., DigitalOcean, AWS)
- Local Linux/Ubuntu server
- HTTPS with Let’s Encrypt
- Reverse proxy with NGINX (optional)

---

## 11. Future Features
- Plugin Marketplace
- Dashboard Sharing & Export
- Real-time collaboration
- Widget templating
- AI Model integrations

---

## 12. Appendices

### 12.1 Glossary
- **Plugin:** Extensible module to enhance platform
- **Panel:** UI visual block
- **Project:** Logical container for dashboards and access

### 12.2 External Libraries
- CASL, Winston, Mongoose, JWT, etc.

### 12.3 Versioning
- Follows Semantic Versioning (SemVer)

---

**Maintained by:** Visual Data Core Team  
**License:** MIT  
**Website:** https://github.com/hcfk/visual-data-core

