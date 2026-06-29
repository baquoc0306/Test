const fs = require('fs');

const files = ['user_csv_part1.ts', 'user_csv_part2.ts', 'user_csv_part3.ts'];

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
      } else if (char === '\"' && (nextChar === ',' || nextChar === '\n' || nextChar === '\r' || !nextChar)) {
        inQuote = false;
      } else if (char === '\"') {
        currentField += '\"';
      } else {
        currentField += char;
      }
    } else {
      if (char === '\"' && currentField === '') {
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

const counts = {};

files.forEach(f => {
  const content = fs.readFileSync('src/' + f, 'utf8');
  const start = content.indexOf('`');
  const end = content.lastIndexOf('`');
  if (start !== -1 && end !== -1) {
    const raw = content.substring(start + 1, end);
    const records = parseCSV(raw);
    console.log(`File [${f}] has ${records.length} parsed CSV rows`);
    records.forEach((cols, rowIdx) => {
      if (cols.length > 1) {
        const empName = cols[1].trim();
        counts[empName] = (counts[empName] || 0) + 1;
      }
    });
  }
});

console.log('CSV Counts per Employee:');
console.log(JSON.stringify(counts, null, 2));
