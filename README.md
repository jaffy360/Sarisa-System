# SARISA System (Local, Modular Skeleton)

Local-only Node.js + Express + SQLite3 app with separate **Parent** and **Child** accounts.
Parent dashboard can link to and view child accounts. Child has its own dashboard.

## Run
```
npm install
npm run init:db   # seed demo users
npm start
# open http://localhost:3000
```

Demo:
- Parent: parent@example.com / password123
- Child:  child@example.com / password123

## Modules
- modules/user       → register, login, logout, /me
- modules/parent     → link-child, list children + stats
- modules/child      → basic tasks CRUD
- modules/adaptive   → accessibility settings (API)
- modules/learning   → placeholder routes
- modules/rewards    → reward listing (API)


