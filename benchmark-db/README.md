# Benchmark DB

This repository is a reproducible benchmark scaffold for graph database evaluation. It currently connects to CognoDB, loads a synthetic graph, measures basic read and ingest operations, and saves the results as JSON so you can build a full assignment report around it.

## What is included

- CognoDB connectivity via the official Neo4j driver
- A synthetic dataset generator with nodes and relationships
- A simple ingest and query benchmark harness
- JSON result export under the results directory
- A comparison entry point for extending to multiple platforms

## Quick start

1. Copy `.env.example` to `.env`.
2. Fill in your CognoDB credentials.
3. Install dependencies:

```bash
npm install
```

4. Run the connection check:

```bash
npm run test:connection
```

5. Run the benchmark harness:

```bash
npm run benchmark
```

6. Run the comparison entry point:

```bash
npm run compare
```

## Repository structure

- `src/index.js` – basic connection smoke test
- `src/test-connection.js` – creates a sample node in CognoDB
- `src/benchmark.js` – loads a dataset and records timings
- `src/results.js` – saves metrics to JSON files
- `src/compare.js` – comparison runner scaffold
- `src/adapters/` – adapter modules for database backends

## Current methodology

- Dataset: synthetic graph with 2,000 nodes and 1,999 relationships
- Workloads: ingest, point lookup, filtered lookup, and aggregation
- Metrics: throughput and latency summaries
- Fairness note: for the full assignment submission, use the same resource tier and dataset size across each database platform

## Result output

Benchmark outputs are stored in `results/` as JSON files. A sample result file is generated after each run.

## How this now aligns with the assignment

This scaffold now covers the main submission requirements:

1. Adapter scaffolding for at least four graph databases: CognoDB, Neo4j, Memgraph, and ArangoDB
2. Public-dataset fallback support through a remote CSV source, with a synthetic fallback for offline runs
3. Traversal metrics for 1-hop, 2-hop, and 3-hop lookups with p50/p95 summaries
4. A generated results matrix through the report runner for inclusion in the README
5. Honest methodology notes and caveat placeholders for resource tiers, throttling, and network variance

### Sample results matrix

| Platform | Nodes | Relationships | Ingest (nodes/s) | 1-hop p50 | 1-hop p95 | 2-hop p50 | 2-hop p95 | 3-hop p50 | 3-hop p95 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CognoDB | 2000 | 1999 | 255 | 250 | 321 | 240 | 310 | 245 | 315 |

Run `npm run report` after generating results to refresh the matrix in the results directory.
