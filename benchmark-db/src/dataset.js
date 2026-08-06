const https = require('https');

function createSyntheticDataset(size = 2000) {
  const nodes = [];
  const rels = [];

  for (let i = 0; i < size; i += 1) {
    nodes.push({ id: i + 1, name: `Person${i + 1}` });
  }

  for (let i = 0; i < size - 1; i += 1) {
    rels.push({ from: i + 1, to: i + 2, type: 'KNOWS' });
  }

  return { nodes, rels, source: 'Synthetic graph generator' };
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

async function loadPublicDataset() {
  const publicUrls = [
    'https://raw.githubusercontent.com/neo4j-graph-examples/movies/master/data/movies.csv',
  ];

  for (const url of publicUrls) {
    try {
      const raw = await fetchText(url);
      const lines = raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(1);

      if (lines.length >= 3) {
        const nodes = lines.slice(0, 100).map((line, index) => ({ id: index + 1, name: line.split(',')[0] || `Movie${index + 1}` }));
        const rels = [];
        for (let i = 0; i < Math.min(nodes.length - 1, 100); i += 1) {
          rels.push({ from: nodes[i].id, to: nodes[i + 1].id, type: 'RELATED' });
        }
        return { nodes, rels, source: url };
      }
    } catch (error) {
      // fall back to the synthetic dataset below
    }
  }

  return createSyntheticDataset(2000);
}

module.exports = {
  createSyntheticDataset,
  loadPublicDataset,
};
