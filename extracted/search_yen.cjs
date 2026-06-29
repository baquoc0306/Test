const fs = require('fs');

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
  'wanek_idp_raw_data_part7.ts',
  'user_csv_part1.ts',
  'user_csv_part2.ts',
  'user_csv_part3.ts'
];

files.forEach(f => {
  const content = fs.readFileSync('src/' + f, 'utf8');
  const regex = /yen|yến/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    count++;
  }
  if (count > 0) {
    console.log(`File: ${f} | Occurrences of Yen/Yến: ${count}`);
  }
});
