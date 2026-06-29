const fs = require('fs');

const content = fs.readFileSync('src/wanek_idp_raw_data_part6.ts', 'utf8');
const start = content.indexOf('`');
const end = content.lastIndexOf('`');
if (start !== -1 && end !== -1) {
  const rawString = content.substring(start + 1, end);
  const lines = rawString.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('Kelvin Huynh') || l.includes('Tom Nguyen') || l.includes('Dominic Duong')) {
      console.log(`Line ${idx + 1}: ${l.substring(0, 100)}...`);
    }
  });
}
