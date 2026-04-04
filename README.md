# CCCv2 - Catalyst Center Product Flow Learning App

V2 is a new Electron + React + TypeScript + Vite project focused on Catalyst Center product flow learning.

## Phase 1 Scope
- Dashboard (Product Flow Hub)
- Discovery
- Inventory
- Topology
- Device 360
- Settings (minimal)
- Jobs (supplemental)

## Product Flow
Discovery → Inventory → Topology → Device 360 → Assurance (Assurance itself is out of Phase 1 core implementation).

## Tech Stack
- Electron
- React 18
- TypeScript
- Vite
- Local mock seed data only

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Project Structure
- `electron/` main/preload process
- `src/app/` shell, routing, shared app state
- `src/components/` common UI parts
- `src/features/` phase1 screens
- `src/domains/` domain types
- `src/repositories/` repository layer
- `src/data/seed/` seed scenarios
- `src/styles/` theme tokens/CSS vars
- `docs/` design and implementation notes
