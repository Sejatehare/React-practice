async function runArangoDbBenchmark() {
  return {
    platform: 'ArangoDB',
    status: 'not configured',
    note: 'Add an ArangoDB driver and environment variables to enable this adapter.'
  };
}

module.exports = { runArangoDbBenchmark };
