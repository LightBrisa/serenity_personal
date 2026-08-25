# Serenity

Serenity is an AI-native investment research workspace for turning a raw stock idea into an evidence-based, falsifiable, continuously monitored investment thesis.

This repository currently implements **Phase 1**: a polished, clickable NVDA vertical slice built with deterministic demo fixtures. It covers the Idea Inbox, editable Idea Breakdown, Research Workspace, persistent Thesis Card, Thesis Monitor, and version history. No screen presents fixture content as live market data, and the application does not provide buy/sell recommendations or trading functionality.

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Architecture

- `app/` — route surfaces for the end-to-end product journey
- `src/components/` — reusable research UI and interactive controls
- `src/domain/` — product types, validated AI-contract schemas, and deterministic calculations
- `src/data/` — explicitly labeled, time-bounded NVDA demo fixtures
- `src/db/` — typed Drizzle schema for the future persistence layer

The UI reads only from fixtures in Phase 1. Model calls, provider adapters, source ingestion, persistence, and scheduled monitoring begin in Phase 2 and later.

## Safety

Serenity is a research and reasoning tool, not an investment adviser or trading system. Evidence is labeled by provenance and relation to the thesis. Raw source facts remain separate from AI interpretation, unknowns remain explicit, and thesis history is append-only.
