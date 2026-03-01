# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Running the full project (backend + frontend)

Backend (ASP.NET 10) lives in the workspace at `TripPlannerVibeCode/TripPlanner`.

- From the workspace root open a terminal and run:

```bash
cd TripPlannerVibeCode/TripPlanner
dotnet run
```

By default the API listens on `https://localhost:7085` (see `Properties/launchSettings.json`).

Frontend (React + Vite):

```bash
cd trip-planner-front
npm install
npm run dev
```

The front-end will proxy requests (directly) to the API at `https://localhost:7085/api` via the configured axios base URL.

SCSS: a global SCSS file was added at `src/styles/main.scss`. Make sure `sass` is installed if you encounter build errors:

```bash
npm install -D sass
```
