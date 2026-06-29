const fs = require('fs');
const path = require('path');

const dir = 'src';
const searchTerms = ['dominic', 'tom nguyen', 'kelvin', 'amber dinh', 'annie nguyen'];

fs.readdirSync(dir).forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.statSync(filePath).isFile() && file.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    searchTerms.forEach(term => {
      const regex = new RegExp(term, 'gi');
      let match;
      let count = 0;
      while ((match = regex.exec(content)) !== null) {
        count++;
      }
      if (count > 0) {
        console.log(`File: ${file} | Term: "${term}" | Occurrences: ${count}`);
      }
    });
  }
});
