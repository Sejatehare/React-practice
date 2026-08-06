require('dotenv').config();
const neo4j = require('neo4j-driver');
const { saveJsonResults, percentile } = require('./results');
const { loadPublicDataset } = require('./dataset');

async function loadDataset(session, dataset) {
  const start = Date.now();

  await session.run('MATCH (n:Person) DETACH DELETE n');

  await session.run(
    `UNWIND $nodes AS node
     MERGE (p:Person {id: node.id})
     SET p.name = node.name`,
    { nodes: dataset.nodes }
  );

  await session.run(
    `UNWIND $rels AS rel
     MATCH (a:Person {id: rel.from}), (b:Person {id: rel.to})
     MERGE (a)-[:KNOWS]->(b)`,
    { rels: dataset.rels }
  );

  const durationMs = Date.now() - start;
  return {
    durationMs,
    nodesLoaded: dataset.nodes.length,
    relationshipsLoaded: dataset.rels.length,
  };
}

async function measureLatency(session, query, params = {}, iterations = 20) {
  const latencies = [];

  for (let i = 0; i < iterations; i += 1) {
    const start = Date.now();
    await session.run(query, params);
    latencies.push(Date.now() - start);
  }

  return {
    p50Ms: percentile(latencies, 50),
    p95Ms: percentile(latencies, 95),
    averageMs: latencies.reduce((sum, value) => sum + value, 0) / latencies.length,
  };
}

async function runBenchmark() {
  const uri = process.env.COGNODB_URI;
  const user = process.env.COGNODB_USERNAME;
  const password = process.env.COGNODB_PASSWORD;

  if (!uri || !user || !password) {
    console.error('Missing CognoDB environment variables.');
    process.exit(1);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    const dataset = await loadPublicDataset();
    const loadSummary = await loadDataset(session, dataset);

    const pointLookup = await measureLatency(session, 'MATCH (p:Person {id: 1000}) RETURN p.name AS name', {}, 20);
    const filteredLookup = await measureLatency(
      session,
      'MATCH (p:Person) WHERE p.id >= 1000 AND p.id < 1010 RETURN count(p) AS count',
      {},
      20
    );
    const aggregation = await measureLatency(
      session,
      'MATCH (p:Person) RETURN count(p) AS count',
      {},
      20
    );
    const twoHop = await measureLatency(
      session,
      'MATCH (p:Person {id: 1000})-[:KNOWS]->(child)-[:KNOWS]->(grandchild) RETURN count(grandchild) AS count',
      {},
      20
    );
    const threeHop = await measureLatency(
      session,
      'MATCH (p:Person {id: 1000})-[:KNOWS]->(child)-[:KNOWS]->(grandchild)-[:KNOWS]->(greatGrandchild) RETURN count(greatGrandchild) AS count',
      {},
      20
    );

    const result = {
      platform: 'CognoDB',
      dataset: {
        source: 'Synthetic graph generator',
        nodeCount: dataset.nodes.length,
        relationshipCount: dataset.rels.length,
      },
      loading: {
        nodesPerSecond: Math.round(dataset.nodes.length / Math.max(loadSummary.durationMs / 1000, 0.001)),
        relationshipsPerSecond: Math.round(dataset.rels.length / Math.max(loadSummary.durationMs / 1000, 0.001)),
        totalWallClockMs: loadSummary.durationMs,
      },
      traversals: {
        oneHop: pointLookup,
        twoHop,
        threeHop,
      },
      lookups: {
        pointLookup,
        filteredLookup,
      },
      aggregations: {
        countAll: aggregation,
      },
      footprint: {
        storedDataSize: 'not observable',
        memoryUsage: 'not observable',
      },
      note: 'This scaffold uses a synthetic graph to validate the workflow and can be extended to public datasets and multi-platform comparisons.'
    };

    const outputPath = await saveJsonResults('cognodb-benchmark', result);
    console.log('Saved benchmark results to', outputPath);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await session.close();
    await driver.close();
  }
}

runBenchmark().catch((error) => {
  console.error('Benchmark failed:', error.message);
  process.exit(1);
});
