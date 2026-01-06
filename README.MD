<div align="center">

# Cinemic 🎬

### A full-stack movie database application featuring social interactions, real-time updates, and interactive games.

### Built with a modern TypeScript monorepo architecture.

<!-- Tech Stack Badges -->
<p>
  <img src="https://img.shields.io/badge/React_19-20232a?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript_5.9-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Redux-593d88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MUI_v7-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI" />
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />  
  <img src="https://img.shields.io/badge/FSD_Architecture-black?style=for-the-badge" alt="FSD" />
</p>

</div>

---

## 📖 Overview

**Cinemic** simulates a movie aggregation platform (similar to IMDb or Kinopoisk). It goes beyond simple data display by
integrating social features, gamification, and robust role-based access control.

The application is built using **Feature-Sliced Design (FSD)** principles to ensure scalability and maintainability,
utilizing a unified monorepo structure.

## ✨ Features

### 👤 User Experience

* **Discovery:** Advanced search for titles and a "Random Title" generator for indecisive viewers.
* **Tracking:** Add movies to a personal Watchlist.
* **Interaction:** Rate titles and leave detailed reviews.
* **Gamification:** "Title Guesser" — A trivia game to test your movie knowledge against the database.
* **Accessibility:** Complete **Dark/Light theme** support and **EN/RU Localization**.

### 🤝 Social & Real-Time

* **Friends System:** Add other users to your network.
* **Live Updates:** Real-time notifications for friend activities and system alerts (powered by Socket.io).

### 🛡️ Administration

* **Role-Based Access:** Dedicated panels for Moderators and Administrators to manage content and users.

## 🛠️ Tech Stack

This project pushes the boundaries with the latest versions of modern tools:

### Core & Architecture

* **Language:** TypeScript 5.9
* **Architecture:** Feature-Sliced Design (validated by `steiger`)
* **Bundling:** Next.js 16.1 (with SWC for fast compilation)
* **Validation:** Valibot (Schema validation)

### Frontend

* **Framework:** React 19
* **State Management:** Redux Toolkit (RTK)
* **Routing:** React Router v7
* **UI Components:** Material UI (MUI) v7
* **Internationalization:** i18next / react-i18next
* **Real-time:** Socket.io Client

### Backend

* **Runtime:** Node.js
* **Framework:** Express v5
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT & BCrypt (with secure cookie handling)
* **Real-time:** Socket.io

### Quality Assurance

* **Testing:** Jest, React Testing Library, MSW (Mock Service Worker)
* **Linting:** ESLint 9, Prettier
* **Dependency Check:** Madge (Circular dependency detection)

## 🚀 Getting Started

### Prerequisites

* Node.js (v20+ recommended)
* MongoDB (Local instance or Atlas connection string)

### Installation & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development**
   ```bash
   # Run Frontend (in one terminal)
   npm dev:https

   # Run Backend (in another terminal)
   npm run server
   ```

## 🧪 Scripts

* `npm dev:https` - Run frontend in development mode (experimental https).
* `npm run server` - Run backend in development mode.
* `npm run type-check` - Run TypeScript type checking.
* `npm run dep:cycles` - Check for circular dependencies.
* `npm test` - Run unit and integration tests.
* `npm run prod:analyze` - Build production bundle and visualize size.

## 📝 License

Distributed under the **ISC License**.