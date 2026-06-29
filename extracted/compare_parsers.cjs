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
  return hasHeader ? records.slice(1) : records;
}

function lineByLineParse(text, hasHeader) {
  const rawLines = text.split('\n');
  const parsedRows = [];
  
  for (let line of rawLines) {
    line = line.trim();
    if (!line) continue;
    const cols = line.split('\t');
    const isNewRow = cols.length >= 5 && (/^\d+$/.test(cols[0]) || cols[0] === '' || cols[0] === '-' || cols[0] === 'Emp Code');
    
    if (isNewRow) {
      parsedRows.push(cols);
    } else {
      if (parsedRows.length > 0) {
        const lastRow = parsedRows[parsedRows.length - 1];
        lastRow[lastRow.length - 1] += ' ' + line;
      }
    }
  }
  return hasHeader ? parsedRows.slice(1) : parsedRows;
}

const content = fs.readFileSync('src/wanek_idp_raw_data_part7.ts', 'utf8');
const start = content.indexOf('`');
const end = content.lastIndexOf('`');
const raw = content.substring(start + 1, end);

const parsedWanek = parseWanekTSV(raw, false);
const parsedLBL = lineByLineParse(raw, false);

console.log(`Wanek TSV Parse: ${parsedWanek.length} records`);
console.log(`Line by Line Parse: ${parsedLBL.length} records`);

const lblNames = {};
parsedLBL.forEach(r => {
  const name = r[1] || '';
  lblNames[name] = (lblNames[name] || 0) + 1;
});

const wanekNames = {};
parsedWanek.forEach(r => {
  const name = r[1] || '';
  wanekNames[name] = (wanekNames[name] || 0) + 1;
});

console.log('\nComparison of record counts per Employee in Part 7:');
const allNames = new Set([...Object.keys(lblNames), ...Object.keys(wanekNames)]);
allNames.forEach(name => {
  if (name) {
    console.log(`Employee: ${name.padEnd(30)} | LineByLine: ${lblNames[name] || 0} | WanekTSV: ${wanekNames[name] || 0}`);
  }
});
