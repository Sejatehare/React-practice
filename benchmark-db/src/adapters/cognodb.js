const neo4j = require('neo4j-driver');

async function runCognodbBenchmark(config) {
  const driver = neo4j.driver(config.uri, neo4j.auth.basic(config.username, config.password));
  const session = driver.session();

  try {
    await session.run('RETURN 1 AS value');
    return {
      platform: 'CognoDB',
      status: 'ok',
      note: 'Adapter scaffold ready for full benchmark expansion.'
    };
  } finally {
    await session.close();
    await driver.close();
  }
}

module.exports = { runCognodbBenchmark };
