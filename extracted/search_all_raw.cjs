const fs = require('fs');

// We will load the raw strings from the TS/JS files directly or read files to grab what's in the backticks.
function parseTSV(tsvString, hasHeader) {
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

// Read raw strings
function getRawString(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const start = content.indexOf('`');
  const end = content.lastIndexOf('`');
  if (start !== -1 && end !== -1) {
    return content.substring(start + 1, end);
  }
  return '';
}

const wnkNames = [
  "Amber Dinh", "Anna Tran", "Annie Nguyen", "Ashton Vo", "Bui Van Thap", "Chivas Cao",
  "Dang Van Tan", "Daniel Pham", "Danny Cao", "Dinh Thi Hong Van", "Do Thi Thanh Nga",
  "Dominic Duong", "Duong Tri Dung", "Elsa Nguyen", "Giap Quang Huy", "Ginta Doan",
  "Hana Truong", "Harvey Nguyen / Edgar Bui", "Huynh Van Nhat", "Kelvin Huynh",
  "Le Thi Huong", "Le Thi Tuyen", "Le Tuan Anh", "Leo Le", "Lucian Nguyen", "Ly Thanh Tung",
  "Mai Hai Long", "Mai Thi Hoang Bich Tram", "Mai Thi Loan", "Ngo Huu Chi", "Nguyen Dang Viet",
  "Nguyen Hai Trieu", "Nguyen Phuoc Duy", "Nguyen Thi Mong Van", "Nguyen Trong Thuy",
  "Pham Dinh Tung", "Pham Hung Minh", "Phan Thanh Son", "Phan Thi Ha", "Quach Le Du",
  "Quyen Lam", "Thuy Do", "Tom Nguyen", "Tong Thi Sang", "Tran Cong Minh", "Tran Minh Thuan",
  "Trinh Ngoc Phien", "Trinh Thi Kim Loan", "Truong Minh Hung", "Truong Thi Thuy Trang",
  "Tuan Nguyen", "Vo Chi Tinh", "Vo Vu Luan", "Vu Van Xuan", "Willy Pham"
];

function clean(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const cleanedWnkNames = wnkNames.map(n => clean(n));
const wnkNamesMap = {};
wnkNames.forEach(n => {
  wnkNamesMap[clean(n)] = n;
});

// Let's also split names for checking
const individualWnkNames = new Set();
wnkNames.forEach(n => {
  n.split('/').forEach(part => {
    individualWnkNames.add(clean(part));
  });
});

const fileData = {};

const tsvFiles = {
  'raw_tsv_data.ts': true,
  'raw_tsv_data_cohort1.ts': true,
  'raw_tsv_data_cohort2.ts': true,
  'raw_tsv_data_cohort3.ts': true,
  'wanek_idp_raw_data.ts': true,
  'wanek_idp_raw_data_part2.ts': false,
  'wanek_idp_raw_data_part3.ts': false,
  'wanek_idp_raw_data_part4.ts': false,
  'wanek_idp_raw_data_part5.ts': false,
  'wanek_idp_raw_data_part6.ts': false,
  'wanek_idp_raw_data_part7.ts': false,
};

const csvFiles = [
  'user_csv_part1.ts',
  'user_csv_part2.ts',
  'user_csv_part3.ts'
];

const countsByFileAndName = {};

Object.entries(tsvFiles).forEach(([f, hasHeader]) => {
  const raw = getRawString('src/' + f);
  const records = parseTSV(raw, hasHeader);
  records.forEach(cols => {
    if (cols.length > 1) {
      const nameCol = cols[1].trim();
      const nameClean = clean(nameCol);
      if (individualWnkNames.has(nameClean) || cleanedWnkNames.includes(nameClean)) {
        const canonicalName = wnkNamesMap[nameClean] || nameCol;
        if (!countsByFileAndName[canonicalName]) countsByFileAndName[canonicalName] = {};
        countsByFileAndName[canonicalName][f] = (countsByFileAndName[canonicalName][f] || 0) + 1;
      }
    }
  });
});

csvFiles.forEach(f => {
  const raw = getRawString('src/' + f);
  const records = parseCSV(raw);
  records.forEach(cols => {
    if (cols.length > 2) {
      const nameCol = cols[2].trim();
      const nameClean = clean(nameCol);
      if (individualWnkNames.has(nameClean) || cleanedWnkNames.includes(nameClean)) {
        const canonicalName = wnkNamesMap[nameClean] || nameCol;
        if (!countsByFileAndName[canonicalName]) countsByFileAndName[canonicalName] = {};
        countsByFileAndName[canonicalName][f] = (countsByFileAndName[canonicalName][f] || 0) + 1;
      }
    }
  });
});

console.log('Counts by File and Name for WNK employees:');
console.log(JSON.stringify(countsByFileAndName, null, 2));
