# Production Scope Engine

Real-time project scoping, forecasting, and production planning powered by structured inputs and historical data.

The Production Scope Engine transforms project inputs into real-time scope, timeline, labor, and production decisions. It standardizes intake, applies structured scoring models, and leverages historical project data to generate accurate forecasts and clear next actions for execution.

Public GitHub Pages URL:

```txt
https://cfxnyc.github.io/Production-Scope-Engine/
```

## Launch

Double-clicking `index.html` will not launch the app correctly because the React code needs to be served by Vite.

Use one of these for the full app with workbook writes:

```bash
./LAUNCH_APP.command
```

Or run both processes manually in separate terminals:

```bash
npm run api
npm run dev
```

Then open:

```txt
http://127.0.0.1:5174/
```

The local API writes workbook changes to the OneDrive-synced source of truth:

```txt
~/Library/CloudStorage/OneDrive-EquinoxFitness/Documents/Content Development/APPS/Content Dev. Scope/Content_Scope_DataHub.xlsx
```

Every workbook write creates a timestamped `.backup-*.xlsx` copy next to the workbook before saving.
