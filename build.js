const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'public', 'img');
const out = path.join(__dirname, 'public', 'assets');
fs.mkdirSync(out, { recursive: true });

const files = {
  'nter-banner.b64': 'banner.webp',
  'do-parliamentarians-really-care.b64': 'parliament.webp',
  'seven-bills-on-the-floor.b64': 'bills.webp',
  'cyber-crime-india.b64': 'cyber.webp',
  'aravalli-hearing.b64': 'aravalli.webp',
  'gems-of-india.b64': 'gems.webp'
};

for (const [input, output] of Object.entries(files)) {
  const b64 = fs.readFileSync(path.join(src, input), 'utf8').trim();
  fs.writeFileSync(path.join(out, output), Buffer.from(b64, 'base64'));
  console.log(`built ${output}`);
}
