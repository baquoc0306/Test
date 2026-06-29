const fs = require('fs');

function parseCSV(csvString) {
  const records = [];
  let currentRecord = [];
  let currentField = '';
  let inQuote = false;
  
  for (let i = 0; i < csvString.length; i++) {
    const char = csvString[i];
    const nextChar = csvString[i + 1];
    if (inQuote) {
      if (char === '\"' && nextChar === '\"') {
        currentField += '\"';
        i++;
      } else if (char === '\"') {
        inQuote = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '\"') {
        inQuote = true;
      } else if (char === ',') {
        currentRecord.push(currentField);
        currentField = '';
      } else if (char === '\n') {
        currentRecord.push(currentField);
        records.push(currentRecord);
        currentRecord = [];
        currentField = '';
      } else if (char === '\r') {
        // ignore
      } else {
        currentField += char;
      }
    }
  }
  if (currentField !== '' || currentRecord.length > 0) {
    currentRecord.push(currentField);
    records.push(currentRecord);
  }
  return records;
}

const files = ['user_csv_part1.ts', 'user_csv_part2.ts', 'user_csv_part3.ts'];
const nameCounts = {};

files.forEach(f => {
  const content = fs.readFileSync('src/' + f, 'utf8');
  const start = content.indexOf('`');
  const end = content.lastIndexOf('`');
  if (start !== -1 && end !== -1) {
    const rawString = content.substring(start + 1, end);
    const records = parseCSV(rawString);
    records.forEach((cols, idx) => {
      if (cols.length > 2) {
        const name = cols[2].trim();
        if (name && name !== 'Person Name' && name !== 'Name' && !name.includes('export const')) {
          nameCounts[name] = (nameCounts[name] || 0) + 1;
        }
      }
    });
  }
});

console.log('Unique employee names and count in CSV files:');
console.log(JSON.stringify(nameCounts, null, 2));
