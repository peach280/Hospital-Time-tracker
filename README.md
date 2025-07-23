# 🕒 Care Worker Shift Tracker (PWA)

## 🧾 Overview

This is a **Progressive Web App (PWA)** built with **Next.js**, **Prisma**, and **Auth0**, designed to help care workers track their shifts via clock in/out actions. It includes **location-based access control** and **push notifications**, and is installable on mobile/desktop for a native-like experience.

---

## ✅ Features Attempted

- ✅ **Clock In/Out functionality**  
  Care workers can clock in or out, and their location is logged along with an optional note.

- ✅ **Authentication with Auth0**  
  Login/logout integrated using Auth0’s universal login.

- ✅ **Progressive Web App (PWA)**  
  The app is installable, works offline (static assets), and runs like a native app.

- ✅ **Geofenced Perimeter Check**  
  A location check ensures clock in is allowed only when inside the manager-defined radius.

---

## 📁 Folder Structure

```bash /app
  /api
    /auth/sync-user
      └─ route.js              # Sync user data post-authentication
    /clockin
      └─ route.js              # Handles clock-in requests
    /clockout
      └─ route.js              # Handles clock-out requests
    /geocode
      └─ route.js              # Converts coordinates to address
    /location
      └─ route.js              # Store or get manager's base location
    /perimeter
      └─ route.js              # Store or get perimeter radius
    /perimeter-check
      └─ route.js              # Verifies if location is within perimeter
    /shifts
      └─ route.js              # Retrieves all shift records

  /care-worker
    └─ page.js                 # UI for care workers to clock in/out

  /manager
    ├─ page.js                 # Manager dashboard (entry point)
    ├─ locationdisplay.js      # Displays clock-in/out data and location

  ├─ Auth0Provider.js          # Auth0 wrapper for global access
  ├─ layout.js                 # Global layout
  ├─ page.js                   # App entry
  ├─ globals.css               # Global styles
  ├─ favicon.ico               # App icon

/prisma
  ├─ schema.prisma             # Prisma data models
  └─ dev.db                    # SQLite database (local only)

/public
  └─ (static assets)

/node_modules
.env
.env.local
.gitignore
next.config.mjs
eslint.config.mjs
jsconfig.json
README.md
```

