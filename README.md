# Aura — Industrial ERP System

A full-stack ERP (Enterprise Resource Planning) application for industrial teams. Manage clients, proposals, production orders, and audit trails — all from a single AdminJS-powered dashboard.

## Overview

Aura lets you track the full lifecycle of industrial operations: from client proposals through to production orders and delivery. Every change is logged in an audit trail with full traceability.

### Key Features

- **Proposal Management** — Create, track, and convert client proposals into production orders with version history
- **Production Tracking** — Monitor orders across sections (Metalwork, Painting, Assembly) in real-time
- **Audit Logging** — Every status change, edit, and conversion is recorded with who/what/when
- **Role-Based Access** — Admin, Sales, Production, and Viewer permission levels
- **Client Database** — Centralized registry with contact info and VAT details
- **Product Catalogue** — Manage raw materials and finished goods with units and pricing

## Tech Stack

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| **Frontend**  | React 19 + TypeScript + Vite 7 + Tailwind CSS 4 |
| **Backend**   | Node.js + Express + TypeScript                  |
| **Admin**     | AdminJS 7 (at `/admin` on port 5000)            |
| **Database**  | PostgreSQL 15                                   |
| **DB GUI**    | pgAdmin 4 (port 5050)                           |
| **Infra**     | Docker + Docker Compose                         |

### Frontend Details

- **UI Library** — React 19 with Motion (Framer Motion) for animations
- **Styling** — Tailwind CSS v4 + custom CSS with theme variables
- **Theming** — 6 accent colors (Indigo, Rose, Emerald, Amber, Cyan, Purple) + light/dark mode toggle
- **Icons** — Font Awesome 6
- **Font** — Outfit (Google Fonts)

### Database Schema

| Table            | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `users`          | System users with roles                  |
| `clients`        | Client registry (name, email, VAT, etc.) |
| `sections`       | Production sections (Metalwork, etc.)    |
| `products`       | Product/material catalogue               |
| `proposals`      | Client proposals with status tracking    |
| `proposal_items` | Line items for each proposal             |
| `orders`         | Production orders (linked to proposals)  |
| `order_items`    | Line items for each order                |
| `audit_log`      | Full audit trail (JSONB old/new values)  |

## Requirements

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

```bash
git clone https://github.com/yourusername/aura-erp.git
cd aura-erp
docker compose up --build
```

Once running:

| Service        | URL                          |
| -------------- | ---------------------------- |
| Frontend       | http://localhost:5173         |
| Admin Panel    | http://localhost:5000/admin   |
| Backend API    | http://localhost:5000         |
| pgAdmin        | http://localhost:5050         |

### Default Credentials

**pgAdmin:**
- Email: `admin@admin.com`
- Password: `admin`

**Seed Users (in AdminJS):**
- `admin@company.com` — Admin role
- `sales@company.com` — Sales role
- `production@company.com` — Production role

## Project Structure

```
├── docker-compose.yml
├── init.sql                  # DB schema + seed data
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   └── config/
│   │       ├── adminjs.ts    # AdminJS setup
│   │       ├── database.ts
│   │       ├── controllers/
│   │       ├── routes/
│   │       └── services/
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── src/
│   │   ├── App.tsx           # Main app with theming + all sections
│   │   ├── index.css         # Tailwind + custom theme CSS
│   │   └── components/
│   │       ├── AuraLogo.tsx
│   │       ├── DashboardDemo.tsx
│   │       ├── RotatingText.tsx
│   │       └── SpotlightCard.tsx
```

## License

MIT