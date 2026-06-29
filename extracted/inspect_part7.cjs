const fs = require('fs');

const content = fs.readFileSync('src/wanek_idp_raw_data_part7.ts', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('Amber Dinh') || l.includes('Annie Nguyen') || l.includes('Tom Nguyen')) {
    const cols = l.split('\t');
    console.log(`Row ${idx + 1}: Emp[${cols[1] || ''}] Manager[${cols[cols.length - 1] || ''}] Line: ${l.substring(0, 120)}...`);
  }
});
