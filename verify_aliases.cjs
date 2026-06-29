const fs = require('fs');

const aliases = [
  "dominic duong", "duong quoc oai", "dương quốc oai", "duong son duong", "dương sơn dương", "dominic",
  "tom nguyen", "tom", "nguyen van tom", "nguyễn văn tôm",
  "kelvin huynh", "kelvin", "huynh van nhat", "huỳnh văn nhật"
];

const files = [
  'raw_tsv_data.ts',
  'raw_tsv_data_cohort1.ts',
  'raw_tsv_data_cohort2.ts',
  'raw_tsv_data_cohort3.ts',
  'wanek_idp_raw_data.ts',
  'wanek_idp_raw_data_part2.ts',
  'wanek_idp_raw_data_part3.ts',
  'wanek_idp_raw_data_part4.ts',
  'wanek_idp_raw_data_part5.ts',
  'wanek_idp_raw_data_part6.ts',
  'wanek_idp_raw_data_part7.ts'
];

function clean(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function parseTSV(tsvString) {
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
  return records;
}

const cleanedAliases = aliases.map(a => clean(a));

files.forEach(f => {
  const content = fs.readFileSync('src/' + f, 'utf8');
  const start = content.indexOf('`');
  const end = content.lastIndexOf('`');
  if (start !== -1 && end !== -1) {
    const raw = content.substring(start + 1, end);
    const records = parseTSV(raw);
    records.forEach((cols, rowIdx) => {
      if (cols.length > 1) {
        const vName = cols[1].trim();
        const vClean = clean(vName);
        const eName = cols.length > 2 ? cols[2].trim() : '';
        const eClean = clean(eName);
        
        cleanedAliases.forEach((alias, aliasIdx) => {
          if (vClean === alias || eClean === alias) {
            console.log(`MATCH [${aliases[aliasIdx]}] in file [${f}] at Row [${rowIdx + 1}]: "${vName}" / "${eName}"`);
          }
        });
      }
    });
  }
});
