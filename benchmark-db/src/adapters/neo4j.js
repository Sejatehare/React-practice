const neo4j = require('neo4j-driver');

async function runNeo4jBenchmark(config) {
  if (!config.uri || !config.username || !config.password) {
    return { platform: 'Neo4j', status: 'not configured', note: 'Set NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD to enable.' };
  }

  const driver = neo4j.driver(config.uri, neo4j.auth.basic(config.username, config.password));
  const session = driver.session();

  try {
    await session.run('RETURN 1 AS value');
    return { platform: 'Neo4j', status: 'ok', note: 'Adapter ready for benchmark execution.' };
  } finally {
    await session.close();
    await driver.close();
  }
}

module.exports = { runNeo4jBenchmark };
