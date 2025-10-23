// Generates js/env.js from Netlify environment variables
// Netlify runs this during the build (see netlify.toml)

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'js');
const outFile = path.join(outDir, 'env.js');

const keys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
];

const env = {};
let missing = [];
for (const k of keys) {
  const v = process.env[k];
  if (!v) missing.push(k);
  env[k] = v || '';
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const content = `window.env = ${JSON.stringify(env, null, 2)};\n`;
fs.writeFileSync(outFile, content, 'utf8');

if (missing.length) {
  console.warn('Warning: missing env vars ->', missing.join(', '));
} else {
  console.log('All Netlify env vars present.');
}
console.log(`Wrote ${outFile}`);

