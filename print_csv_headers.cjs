const fs = require('fs');

const files = ['user_csv_part1.ts', 'user_csv_part2.ts', 'user_csv_part3.ts'];

files.forEach(f => {
  const content = fs.readFileSync('src/' + f, 'utf8');
  const start = content.indexOf('`');
  const end = content.lastIndexOf('`');
  if (start !== -1 && end !== -1) {
    const raw = content.substring(start + 1, end);
    const lines = raw.split('\n');
    console.log(`--- Header & first 5 lines of [${f}] ---`);
    lines.slice(0, 6).forEach((l, idx) => {
      console.log(`Line ${idx + 1}: ${l}`);
    });
  }
});
