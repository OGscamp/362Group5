# 🛠️ Node.js + TypeScript Server Setup Guide

## 📦 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

---

## 📁 Project Setup

Navigate to the `server` folder in your terminal and run the following commands:

```bash
npm install
npm install -g typescript
```

---

## ⚙️ PowerShell Setup (Only Once!)

To allow remote scripts (required for TypeScript compiler to run smoothly), open **PowerShell as Administrator** and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

> 🛡️ Don’t worry — this is a trusted setting. It allows local scripts to run and is needed for TypeScript to work properly.

---

## 🚀 Running the Server

### 🛠️ Compile TypeScript
```bash
tsc
```

### ▶️ Start the Server
```bash
node src/index.js
```

---

## 🌐 Server Info

- **Base URL:** `http://localhost:3000`
  - `localhost` points to your computer
  - `3000` is the network port the server listens on

---

## 🔁 API Routes

| Method | Endpoint                                  | Description                   |
|--------|-------------------------------------------|-------------------------------|
| GET    | `http://localhost:3000/api/example`       | Example fetch route           |
| POST   | `http://localhost:3000/api/example`       | Example submit route          |
| GET    | `http://localhost:3000/api/example2`      | Another fetch route w/ auth   |
| GET    | `http://localhost:3000/login`			 |                               |




### OR
download docker and run "docker compose up"


