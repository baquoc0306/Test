const fs = require('fs');

const content = fs.readFileSync('src/wanek_idp_raw_data_part2.ts', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  if (/yen|yến/gi.test(l)) {
    const cols = l.split('\t');
    console.log(`Row ${idx + 1}: Emp[${cols[1] || ''}] Manager[${cols[cols.length - 1] || ''}] Line: ${l.substring(0, 100)}...`);
  }
});
