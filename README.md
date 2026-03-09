# 🧵 Textile Factory ERP Backend (Node.js, Express, MongoDB)

A domain-driven manufacturing ERP designed to manage the end-to-end production lifecycle in textile mills. This system automates **beam tracking**, **shift-wise production logging**, and **quality-based payroll computation**, replacing manual registers with atomic, digital transactions.

---

## 🏗️ System Overview

The following flow represents how data moves through the Production Engine to the Reporting and Payroll modules:

**Worker** → **Production Entry** → **Production Engine**
                        ↓
                **Atomic Beam Update**
                        ↓
            **Payroll & Reporting Engines**

---

## ⚙️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
* **Security:** Bcryptjs for password hashing
* **Validation:** Express-validator for strict schema enforcement

---

## 🛠️ Features

### Management Modules

* **Multi-Factory Support:** Orchestrate multiple units and specific looms assigned to each.
* **Beam Lifecycle Tracking:** Monitor `totalMeters`, `producedMeters`, and `remainingMeters`. Beams automatically toggle to `isClosed` status upon exhaustion.
* **Quality & Pricing:** Track fabric qualities with associated price-per-meter history for precise payroll.

### Operational Tools

* **Shift-Based Logging:** Support for three-shift (A, B, C) production entries.
* **Bulk Data Import:** Upsert-capable production logger for high-volume data migration.
* **Loom Management:** Active linking of specific beams and fabric qualities to looms.

---

## 🗄️ Core Data Models

* **Factory:** Physical manufacturing locations.
* **Loom:** Individual machines producing fabric.
* **Beam:** Industrial yarn rolls installed on looms; tracks depletion.
* **Quality:** Fabric specifications and historical price-per-meter.
* **ProductionRecord:** Daily logs connecting operators, looms, shifts, and output.
* **Worker:** System users with roles (`admin`, `manager`, `operator`, `warper`).

---

## 📂 Project Structure

```text
├── config/             # Env configuration (env.js)
├── controllers/        # Request handling & logic orchestration
├── db/                 # Database connection (mongoose.js)
├── middleware/         # Auth (JWT/RBAC) and Error handling
├── models/             # Mongoose schemas (Beam, Loom, Factory, etc.)
├── routes/             # Express route definitions
├── services/           # Complex business logic (payrun, reports)
├── utils/              # Helper functions (dates.js)
├── app.js              # App entry point
└── seed.js             # Database seeding script

```

---

## 📡 API Reference & Examples

### 🔐 Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a new user (Admin/Manager only) |
| POST | `/api/auth/login` | Authenticate and receive JWT |

### 🧵 Production Logging

`POST /api/production`
**Request Body:**

```json
{
  "operatorId": "65d1f...",
  "loomId": "65d2a...",
  "beamId": "65d3b...",
  "qualityId": "65d4c...",
  "factoryId": "65d5e...",
  "date": "2024-03-20",
  "shift": "A",
  "meterProduced": 125.5
}

```

**Response:**

```json
{
  "success": true,
  "message": "Production record created successfully",
  "data": { "remainingMeters": 374.5 }
}

```

### 📊 Reporting & Payroll

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/reports/daily-looms` | Real-time loom efficiency report |
| GET | `/api/reports/payrun` | Automated payroll calculation for date ranges |
| GET | `/api/reports/beam-usage` | Analysis of beam depletion and stock |

---

## ⚙️ Technical Highlights

* **Atomic Transactions:** The system utilizes **Mongoose Sessions** for production logging. If a production entry is recorded but the beam meter update fails, the transaction rolls back to prevent data corruption.
* **Payroll Computation:** The `payrun.service.js` performs complex aggregations, mapping operator output against quality-specific price history to generate gross and net pay.

---

## 🚀 Getting Started

1. **Install Dependencies:**
```bash
npm install

```


2. **Environment Setup:**
Create a `.env` file in the root:
```env
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

```


3. **Seed Initial Data:**
```bash
node seed.js

```


4. **Run Development Server:**
```bash
npm run dev

```



---

## 🔮 Future Improvements

* **Redis Caching:** Implement caching for high-frequency production queries and reports.
* **WebSocket Integration:** Real-time dashboards for live loom status monitoring.
* **Dockerization:** Containerize the environment for consistent deployment.
* **CI/CD:** Automated testing and deployment via GitHub Actions.

---

## 📝 License

This project is licensed under the Apache-2.0 License.

**Author: Rekhta**
