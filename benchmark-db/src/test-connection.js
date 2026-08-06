require('dotenv').config();
const neo4j = require('neo4j-driver');

async function main() {
  const uri = process.env.COGNODB_URI;
  const user = process.env.COGNODB_USERNAME;
  const password = process.env.COGNODB_PASSWORD;

  if (!uri || !user || !password) {
    console.error('Missing CognoDB credentials. Create a .env file from .env.example first.');
    process.exit(1);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  try {
    const session = driver.session();
    const result = await session.run('CREATE (n:ConnectionTest {message: $message}) RETURN n.message AS message', { message: 'Hello CognoDB' });
    console.log('Created node:', result.records[0].get('message'));
    await session.close();
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await driver.close();
  }
}

main();
