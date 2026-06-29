const fs = require('fs');

function parseWanekTSV(tsvString) {
  const records = [];
  let currentRecord = [];
  let currentField = '';
  let inQuote = false;
  
  for (let i = 0; i < tsvString.length; i++) {
    const char = tsvString[i];
    const nextChar = tsvString[i + 1];
    if (inQuote) {
      if (char === '\"' && nextChar === '\"') {
        currentField += '\"';
        i++;
      } else if (char === '\"' && (nextChar === '\t' || nextChar === '\n' || nextChar === '\r' || !nextChar)) {
        inQuote = false;
      } else if (char === '\"') {
        currentField += '\"';
      } else {
        currentField += char;
      }
    } else {
      if (char === '\"' && currentField === '') {
        inQuote = true;
      } else if (char === '\t') {
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

const content = fs.readFileSync('src/wanek_idp_raw_data_part7.ts', 'utf8');
const start = content.indexOf('`');
const end = content.lastIndexOf('`');
const raw = content.substring(start + 1, end);
const parsed = parseWanekTSV(raw);

parsed.forEach((cols, idx) => {
  if (cols.length > 1) {
    console.log(`Index ${idx+1}: Name=[${cols[1]}] Dept=[${cols[2]}] Duty=[${(cols[4] || '').substring(0, 50)}]`);
  }
});
