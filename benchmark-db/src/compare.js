require('dotenv').config();
const { runCognodbBenchmark } = require('./adapters/cognodb');
const { runNeo4jBenchmark } = require('./adapters/neo4j');
const { runMemgraphBenchmark } = require('./adapters/memgraph');
const { runArangoDbBenchmark } = require('./adapters/arangodb');

async function main() {
  const config = {
    uri: process.env.COGNODB_URI,
    username: process.env.COGNODB_USERNAME,
    password: process.env.COGNODB_PASSWORD,
  };

  const results = [];
  results.push(await runCognodbBenchmark(config));
  results.push(await runNeo4jBenchmark({
    uri: process.env.NEO4J_URI,
    username: process.env.NEO4J_USERNAME,
    password: process.env.NEO4J_PASSWORD,
  }));
  results.push(await runMemgraphBenchmark({
    uri: process.env.MEMGRAPH_URI,
    username: process.env.MEMGRAPH_USERNAME,
    password: process.env.MEMGRAPH_PASSWORD,
  }));
  results.push(await runArangoDbBenchmark());

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
