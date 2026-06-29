const fs = require('fs');

function parseWanekTSV(tsvString, hasHeader) {
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
      } else {
        currentField += char;
      }
    }
  }
  if (currentField !== '' || currentRecord.length > 0) {
    currentRecord.push(currentField);
    records.push(currentRecord);
  }
  return hasHeader ? records.slice(1) : records;
}

const files = [
  'wanek_idp_raw_data.ts',
  'wanek_idp_raw_data_part2.ts',
  'wanek_idp_raw_data_part3.ts',
  'wanek_idp_raw_data_part4.ts',
  'wanek_idp_raw_data_part5.ts',
  'wanek_idp_raw_data_part6.ts',
  'wanek_idp_raw_data_part7.ts'
];

const nameCounts = {};

files.forEach((f, idx) => {
  const content = fs.readFileSync('src/' + f, 'utf8');
  const start = content.indexOf('`');
  const end = content.lastIndexOf('`');
  if (start !== -1 && end !== -1) {
    const rawString = content.substring(start + 1, end);
    const records = parseWanekTSV(rawString, idx === 0);
    records.forEach(cols => {
      if (cols.length > 1) {
        const name = cols[1].trim();
        if (name && name !== 'Person Name' && !name.includes('export const')) {
          nameCounts[name] = (nameCounts[name] || 0) + 1;
        }
      }
    });
  }
});

console.log('Unique employee names and count in TSV files:');
console.log(JSON.stringify(nameCounts, null, 2));
