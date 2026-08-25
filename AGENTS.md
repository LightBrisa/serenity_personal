# Serenity engineering principles

## Product north star

Help an ordinary investor turn an external investment idea into an evidence-based, falsifiable, continuously updated investment thesis. The thesis—not the ticker, chart, news feed, or chat—is the primary product object.

## Research behavior

- Organize work as idea → claim → assumptions → evidence → risks → invalidation → monitoring.
- Investigate supporting and contradictory evidence deliberately. Never optimize for a bullish conclusion.
- Keep verified facts, company statements, third-party opinions, market narratives, deterministic calculations, AI inference, and user edits visibly distinct.
- Every material conclusion must cite evidence. Missing material facts are `UNKNOWN`; never manufacture precision or silently fill gaps.
- Assess whether evidence `SUPPORTS`, `CHALLENGES`, or is `NEUTRAL` to a named assumption and explain why.
- Use explainable thesis states only: `STRONG`, `STABLE`, `WATCH`, `WEAKENED`, `INVALIDATED`.
- Monitor assumptions and invalidation conditions, not generic news volume. Prefer fewer high-materiality events.
- Preserve thesis versions. Never overwrite what the user previously believed or the evidence available at that time.

## Time and data correctness

- Track `published_at`, `available_at`, and `retrieved_at` when applicable.
- All research runs have an `as_of` timestamp and must exclude information unavailable at that time.
- Fixture data must be deterministic and unmistakably labeled as demo/not live.
- Numerical calculations belong in deterministic code; the model may explain but must not invent results.
- Financial data access goes through provider interfaces. Domain logic must not depend on one vendor.

## Architecture boundaries

- Keep raw source records, normalized evidence, AI assessments, deterministic calculations, and user-edited conclusions as separate types and persistence records.
- Centralize model access behind an abstraction. Validate every structured model output before persistence and fail visibly on invalid output.
- Keep the initial application a typed modular monolith. Do not introduce microservices before the product requires them.
- Prefer one complete vertical slice over shallow breadth across many tickers.
- Store regression fixtures and eval cases alongside prompt/model changes.

## Safety boundary

- Do not add brokerage credentials, order execution, automated personalized buy/sell recommendations, guaranteed-return language, or trading signals.
- Prefer language such as “evidence supports,” “evidence challenges,” “uncertainty remains,” and “this assumption should be monitored.”

## UX principles

- Calm, professional, analytical, modern, and information-dense without becoming overwhelming.
- Make citations and evidence provenance prominent.
- AI belongs inside an observable research workflow; do not make the product a giant chat surface.
- Avoid casino aesthetics, excessive red/green, meaningless scores, and decorative complexity.

## Windows UTF-8 guardrail

Before PowerShell, Python, Node, document, Markdown, JSON, CSV, or piped commands that may touch Chinese content or paths, configure UTF-8 explicitly:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.UTF8Encoding]::new()
$env:PYTHONIOENCODING = "utf-8"
```

Use explicit UTF-8 when reading or writing text, then read back a sample and stop if `??`, mojibake, or replacement characters appear.
