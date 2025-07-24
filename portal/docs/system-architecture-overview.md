# System Architecture Overview - Visual Data Core

## 1. Introduction
Visual Data Core is a modern, open-source, modular data visualization and dashboard platform. It is designed to be extensible and supports real-time and historical data visualization through pluggable data sources, interactive panels, and AI integrations.

This document provides a high-level architecture overview of Visual Data Core and its main subsystems.

---

## 2. Architecture Layers

### 2.1. Frontend Layer
**Tech Stack**: React 18+, Vite, Redux Toolkit, Axios, CoreUI

**Responsibilities**:
- Render dashboards, panels, and plugin interfaces
- Provide project and user management interfaces
- Handle user authentication & authorization
- Communicate with backend via REST APIs

### 2.2. Backend Layer
**Tech Stack**: Node.js, Express.js, MongoDB (Mongoose), Winston, CASL, JWT

**Responsibilities**:
- Serve REST APIs to the frontend
- Manage users, roles, and projects
- Authenticate and authorize requests
- Manage plugin lifecycle and data source configurations
- Serve plugin and configuration metadata
- Process cron jobs and async background tasks

### 2.3. Plugin System
**Types**:
- App Plugins
- Data Source Plugins
- Panel Plugins
- UI Extension Plugins
- AI Plugins (e.g., NLP summarization, anomaly detection)

**Structure**:
Each plugin lives under `plugins/` with its own folder, containing at least:
- `plugin.json`
- `src/module.ts`

Plugins are dynamically loaded based on project configuration.

### 2.4. Database Layer
**MongoDB Collections**:
- `users` - stores user profiles
- `projects` - stores project metadata and members
- `plugins` - registered plugins and configs
- `logs` - application and audit logs
- `filequeues`, `statistics`, etc. (domain-specific data)

### 2.5. Authorization Layer
**Powered by CASL**:
- Role-based and attribute-based permissions
- Scoped to projects and plugin capabilities

### 2.6. Logging & Monitoring
- All critical actions (login, create project, data sync, etc.) are logged using Winston.
- Optional: Integration with external log management or APM systems.

---

## 3. Deployment Options
- ✅ Self-hosted (Docker/VM)
- ✅ Cloud-native deployment (Kubernetes)
- ✅ Local (for development/testing)

Each deployment supports flexible configuration via `.env` and database-stored settings.

---

## 4. Security & Access Control
- JWT-based authentication
- Role-based authorization (SuperAdmin, ProjectAdmin, ProjectUser, etc.)
- Secure storage of passwords (hashed)
- Token expiration & refresh mechanisms

---

## 5. Extensibility & Customization
- Developers can create custom plugins for new data sources, visualizations, or AI workflows.
- Built-in developer-friendly structure with auto-discovery of plugin types.

---

## 6. Future Enhancements
- Multi-tenancy
- OAuth2 / SSO support
- WebSocket support for real-time updates
- Built-in audit trail UI
- Dynamic dashboard templating

---

## 7. Diagram (To be added)
A full system diagram showing relationships between:
- Frontend components
- REST API endpoints
- Plugin loader
- Project manager
- DB collections

(Consider PlantUML or Mermaid.js syntax for embedding in docs.)

---

> ✅ This system architecture is designed to empower developers and organizations to quickly build, customize, and deploy data-driven visualization solutions using Visual Data Core.