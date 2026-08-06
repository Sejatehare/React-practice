const fs = require('fs/promises');
const path = require('path');

async function ensureResultsDir() {
  const dir = path.join(process.cwd(), 'results');
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function saveJsonResults(name, payload) {
  const dir = await ensureResultsDir();
  const filePath = path.join(dir, `${name}.json`);
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2));
  return filePath;
}

async function saveCsvResults(name, rows) {
  const dir = await ensureResultsDir();
  const filePath = path.join(dir, `${name}.csv`);
  const header = Object.keys(rows[0] || {}).join(',');
  const body = rows.map((row) => Object.values(row).join(',')).join('\n');
  await fs.writeFile(filePath, `${header}\n${body}\n`);
  return filePath;
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[index];
}

module.exports = {
  saveJsonResults,
  saveCsvResults,
  percentile,
};
