# Getting Started with Visual Data Core

Welcome to **Visual Data Core**, an open-source, modular data dashboard platform. This guide will help you get started with setting up and running the project locally.

---

## 🚀 Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or via cloud)
- [Git](https://git-scm.com/)
- [PNPM](https://pnpm.io/) (preferred) or NPM/Yarn

---

## 📦 Clone the Repository

```bash
git clone https://github.com/hcfk/visual-data-core.git
cd visual-data-core
```

---

## 📁 Project Structure

```
visual-data-core/
├── client/         # Frontend (React + Vite + CoreUI)
├── server/         # Backend (Node.js + Express + MongoDB)
├── plugins/        # Plugin architecture (data-sources, panels, ai, etc.)
├── docs/           # Project documentation
├── .env            # Environment config
└── README.md
```

---

## ⚙️ Setup Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Update MongoDB URI, JWT secrets, and any API keys.

---

## 📲 Install Dependencies

Install both frontend and backend dependencies:

```bash
# Backend
cd server
pnpm install

# Frontend
cd ../client
pnpm install
```

---

## ▶️ Run the Application

### Start the backend
```bash
cd server
pnpm dev
```

### Start the frontend
```bash
cd client
pnpm dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173)

---

## 🧪 Seeding the Database

To add default admin and users:

```bash
cd server
pnpm seed
```

---

## 🔌 Explore Plugins
Visual Data Core supports modular plugin architecture. Check the `plugins/` folder and [Plugin Development Docs](./docs) for details.

---

## 📖 Documentation
Full documentation is available inside the `/docs` folder and online soon at [https://visualdatacore.com](https://visualdatacore.com).

---

## 🙌 Community & Contribution
See [CONTRIBUTING.md](./contributing.md) to get involved, report issues, or suggest features.

---

Ready to build powerful dashboards with Visual Data Core? 🎉