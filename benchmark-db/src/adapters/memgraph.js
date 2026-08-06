const neo4j = require('neo4j-driver');

async function runMemgraphBenchmark(config) {
  if (!config.uri || !config.username || !config.password) {
    return { platform: 'Memgraph', status: 'not configured', note: 'Set MEMGRAPH_URI, MEMGRAPH_USERNAME, and MEMGRAPH_PASSWORD to enable.' };
  }

  const driver = neo4j.driver(config.uri, neo4j.auth.basic(config.username, config.password));
  const session = driver.session();

  try {
    await session.run('RETURN 1 AS value');
    return { platform: 'Memgraph', status: 'ok', note: 'Adapter ready for benchmark execution.' };
  } finally {
    await session.close();
    await driver.close();
  }
}

module.exports = { runMemgraphBenchmark };
