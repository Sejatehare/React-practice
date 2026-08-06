require('dotenv').config();
const neo4j = require('neo4j-driver');

async function main() {
  const uri = process.env.COGNODB_URI;
  const user = process.env.COGNODB_USERNAME;
  const password = process.env.COGNODB_PASSWORD;

  if (!uri || !user || !password) {
    console.error('Missing CognoDB environment variables. Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

  try {
    const session = driver.session();
    const result = await session.run('RETURN 1 AS value');
    console.log('Connection OK:', result.records[0].get('value'));
    await session.close();
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  } finally {
    await driver.close();
  }
}

main();
