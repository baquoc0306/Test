const fs = require('fs');

// Full list of 55 employees with their exact Vietnamese and English name variations as requested by the user
const nameMappings = {
  "Amber Dinh": ["amber dinh", "dinh thi hoang yen", "đinh thị hoàng yến", "amber"],
  "Anna Tran": ["anna tran", "tran thi thu hang", "trần thị thu hằng", "anna"],
  "Annie Nguyen": ["annie nguyen", "mai thi hoang bich tram", "mai thị hoàng bích trâm", "annie"],
  "Ashton Vo": ["ashton vo", "vo vu luan", "võ vũ luân", "ashton"],
  "Bui Van Thap": ["bui van thap", "bùi văn tháp"],
  "Chivas Cao": ["chivas cao", "cao thanh sang", "cao thanh sang (chivas)", "chivas"],
  "Dang Van Tan": ["dang van tan", "đặng văn tấn"],
  "Daniel Pham": ["daniel pham", "pham dang khoa", "phạm đăng khoa", "daniel"],
  "Danny Cao": ["danny cao", "cao nhat duy", "cao nhật duy", "danny"],
  "Dinh Thi Hong Van": ["dinh thi hong van", "đinh thị hồng vân"],
  "Do Thi Thanh Nga": ["do thi thanh nga", "đỗ thị thanh nga"],
  "Dominic Duong": ["dominic duong", "duong quoc oai", "dương quốc oai", "duong son duong", "dương sơn dương", "dominic"],
  "Duong Tri Dung": ["duong tri dung", "dương trí dũng"],
  "Elsa Nguyen": ["elsa nguyen", "mai thi loan", "mai thị loan", "elsa"],
  "Giap Quang Huy": ["giap quang huy", "giáp quang huy"],
  "Ginta Doan": ["ginta doan", "ginta"],
  "Hana Truong": ["hana truong", "truong thi thuy trang", "trương thị thùy trang", "hana"],
  "Harvey Nguyen / Edgar Bui": ["harvey nguyen", "edgar bui", "bui trong hung", "bùi trọng hưng", "harvey", "edgar"],
  "Huynh Van Nhat": ["huynh van nhat", "huỳnh văn nhật"],
  "Kelvin Huynh": ["kelvin huynh", "huynh van nhat", "huỳnh văn nhật", "kelvin"],
  "Le Thi Huong": ["le thi huong", "lê thị hương"],
  "Le Thi Tuyen": ["le thi tuyen", "lê thị tuyên"],
  "Le Tuan Anh": ["le tuan anh", "lê tuấn anh"],
  "Leo Le": ["leo le", "leo"],
  "Lucian Nguyen": ["lucian nguyen", "lucian"],
  "Ly Thanh Tung": ["ly thanh tung", "lý thanh tùng"],
  "Mai Hai Long": ["mai hai long", "mai hải long"],
  "Mai Thi Hoang Bich Tram": ["mai thi hoang bich tram", "mai thị hoàng bích trâm"],
  "Mai Thi Loan": ["mai thi loan", "mai thị loan"],
  "Ngo Huu Chi": ["ngo huu chi", "ngô hữu chí"],
  "Nguyen Dang Viet": ["nguyen dang viet", "nguyễn đăng việt"],
  "Nguyen Hai Trieu": ["nguyen hai trieu", "nguyễn hải triều"],
  "Nguyen Phuoc Duy": ["nguyen phuoc duy", "nguyễn phước duy"],
  "Nguyen Thi Mong Van": ["nguyen thi mong van", "nguyễn thị mộng vân"],
  "Nguyen Trong Thuy": ["nguyen trong thuy", "nguyễn trọng thủy"],
  "Pham Dinh Tung": ["pham dinh tung", "phạm đình tùng"],
  "Pham Hung Minh": ["pham hung minh", "phạm hùng minh"],
  "Phan Thanh Son": ["phan thanh son", "phan thanh sơn"],
  "Phan Thi Ha": ["phan thi ha", "phan thị hà"],
  "Quach Le Du": ["quach le du", "quách lê du"],
  "Quyen Lam": ["quyen lam", "quyền lâm"],
  "Thuy Do": ["thuy do", "thúy đỗ", "đỗ thị thúy", "do thi thuy"],
  "Tom Nguyen": ["tom nguyen", "tom"],
  "Tong Thi Sang": ["tong thi sang", "tống thị sáng"],
  "Tran Cong Minh": ["tran cong minh", "trần công minh"],
  "Tran Minh Thuan": ["tran minh thuan", "trần minh thuận"],
  "Trinh Ngoc Phien": ["trinh ngoc phien", "trịnh ngọc phiến"],
  "Trinh Thi Kim Loan": ["trinh thi kim loan", "trịnh thị kim loan"],
  "Truong Minh Hung": ["truong minh hung", "trương minh hùng"],
  "Truong Thi Thuy Trang": ["truong thi thuy trang", "trương thị thùy trang"],
  "Tuan Nguyen": ["tuan nguyen", "tuấn nguyễn", "tuan"],
  "Vo Chi Tinh": ["vo chi tinh", "võ chí tính"],
  "Vo Vu Luan": ["vo vu luan", "võ vũ luân"],
  "Vu Van Xuan": ["vu van xuan", "vũ văn xuân"],
  "Willy Pham": ["willy pham", "willy"]
};

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

function getRawString(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const start = content.indexOf('`');
  const end = content.lastIndexOf('`');
  if (start !== -1 && end !== -1) {
    return content.substring(start + 1, end);
  }
  return '';
}

function clean(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const cleanMappings = {};
for (const [key, list] of Object.entries(nameMappings)) {
  cleanMappings[key] = list.map(n => clean(n));
}

const tsvFiles = [
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

const matchCounts = {};
for (const k of Object.keys(nameMappings)) {
  matchCounts[k] = {};
}

tsvFiles.forEach((f, idx) => {
  const isCohort = f.startsWith('raw_tsv_data');
  const hasHeader = idx === 0 || isCohort;
  const raw = getRawString('src/' + f);
  const records = parseTSV(raw, hasHeader);
  
  records.forEach(cols => {
    if (cols.length > 1) {
      const vName = clean(cols[1]);
      const eName = cols.length > 2 ? clean(cols[2]) : '';
      
      for (const [canonical, cleanList] of Object.entries(cleanMappings)) {
        if (cleanList.includes(vName) || (eName && cleanList.includes(eName))) {
          matchCounts[canonical][f] = (matchCounts[canonical][f] || 0) + 1;
        }
      }
    }
  });
});

console.log('Counts across all files including aliases:');
console.log(JSON.stringify(matchCounts, null, 2));
