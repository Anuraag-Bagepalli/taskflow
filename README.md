
```
rbac-task-manager
├─ backend
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  └─ src
│     ├─ config
│     │  └─ database.js
│     ├─ controllers
│     │  ├─ authController.js
│     │  ├─ insightsController.js
│     │  └─ taskController.js
│     ├─ middleware
│     │  └─ authMiddleware.js
│     ├─ models
│     │  ├─ Task.js
│     │  └─ User.js
│     ├─ routes
│     │  ├─ authRoutes.js
│     │  ├─ insightsRoutes.js
│     │  └─ taskRoutes.js
│     └─ server.js
├─ frontend
│  ├─ .env
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ Navbar.jsx
│  │  │  └─ PrivateRoute.jsx
│  │  ├─ context
│  │  │  └─ AuthContext.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  └─ pages
│  │     ├─ Dashboard.jsx
│  │     ├─ Login.jsx
│  │     ├─ Register.jsx
│  │     ├─ TaskForm.jsx
│  │     └─ Tasks.jsx
│  ├─ tailwind.config.js
│  └─ vite.config.js
└─ README.md

```