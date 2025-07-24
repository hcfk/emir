# Visual Data Core

**Visual Data Core** is an open-source, modular data dashboard platform built with React, CoreUI, and Node.js. It enables real-time and historical data visualization from various data sources — starting with InfluxDB — and is designed to be extensible, customizable, and developer-friendly.

---

## Features

### Core Features (Phase 1)
- Modern and responsive dashboard UI
- Native InfluxDB integration (Flux and InfluxQL support)
- Customizable charts: line, bar, pie, gauge, heatmaps, and more
- Drag-and-drop panel layout with grid-based resizing
- Global and per-panel time range selection with auto-refresh
- Panel configuration editor with query input, chart type, and options
- User authentication and role-based access
- Save/load user dashboards and layouts

### Planned Features (Future Phases)
- Additional data sources: Prometheus, MySQL, PostgreSQL, Elasticsearch, MQTT
- Alerting engine with email/webhook notifications
- Real-time data stream panels via WebSocket or MQTT
- AI-assisted query building and anomaly detection
- Multi-language UI and localization
- Plugin system for custom panels and visualizations
- Data export (CSV, PNG, JSON) and dashboard sharing
- Audit logs and usage statistics for admins

---

## Getting Started

Coming soon…

A detailed guide to set up Visual Data Core locally with both the client and server, including InfluxDB configuration.

---

## Tech Stack

- Frontend: React, CoreUI, Axios, Recharts / Ant Design Charts
- Backend: Node.js, Express, InfluxDB Client
- State Management: Redux Toolkit (planned)
- UI Layout: react-grid-layout (planned)
- Authentication: JWT-based authentication with role control

---

## License

Visual Data Core is licensed under the [Apache License 2.0](./LICENSE).

© 2025 Fatih Kucukpetek / VisualDataCore
