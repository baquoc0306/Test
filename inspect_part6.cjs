const fs = require('fs');

const content = fs.readFileSync('src/wanek_idp_raw_data_part6.ts', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  const cols = l.split('\t');
  if (cols.length > 1) {
    console.log(`Row ${idx + 1}: Emp[${cols[1] || ''}] Manager[${cols[cols.length - 1] || ''}] Duty[${cols[4] || ''}]`);
  }
});
