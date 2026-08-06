const fs = require('fs/promises');
const path = require('path');

async function buildReport() {
  const resultsDir = path.join(process.cwd(), 'results');
  const files = (await fs.readdir(resultsDir)).filter((file) => file.endsWith('.json'));
  const rows = [];

  for (const file of files) {
    const payload = JSON.parse(await fs.readFile(path.join(resultsDir, file), 'utf8'));
    rows.push({
      platform: payload.platform,
      nodes: payload.dataset?.nodeCount || 0,
      relationships: payload.dataset?.relationshipCount || 0,
      ingestNps: payload.loading?.nodesPerSecond || 0,
      p50OneHop: payload.traversals?.oneHop?.p50Ms || 0,
      p95OneHop: payload.traversals?.oneHop?.p95Ms || 0,
      p50TwoHop: payload.traversals?.twoHop?.p50Ms || 0,
      p95TwoHop: payload.traversals?.twoHop?.p95Ms || 0,
      p50ThreeHop: payload.traversals?.threeHop?.p50Ms || 0,
      p95ThreeHop: payload.traversals?.threeHop?.p95Ms || 0,
    });
  }

  const content = [
    '# Benchmark report',
    '',
    '| Platform | Nodes | Relationships | Ingest (nodes/s) | 1-hop p50 | 1-hop p95 | 2-hop p50 | 2-hop p95 | 3-hop p50 | 3-hop p95 |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...rows.map((row) => `| ${row.platform} | ${row.nodes} | ${row.relationships} | ${row.ingestNps} | ${row.p50OneHop} | ${row.p95OneHop} | ${row.p50TwoHop} | ${row.p95TwoHop} | ${row.p50ThreeHop} | ${row.p95ThreeHop} |`),
    '',
    '## Notes',
    '',
    '- The current results are based on the latest benchmark run.',
    '- Extend this report with additional database adapters for a full comparison matrix.',
  ].join('\n');

  await fs.writeFile(path.join(resultsDir, 'benchmark-report.md'), content);
  console.log('Wrote benchmark report to', path.join(resultsDir, 'benchmark-report.md'));
}

buildReport().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
