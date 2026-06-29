const { dbIndividualIDPs } = require('./src/individualDevPlansData.ts');

const counts = {};
dbIndividualIDPs.forEach(idp => {
  const name = idp.viName || idp.engName || 'Unknown';
  counts[name] = (counts[name] || 0) + 1;
});

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log('Currently Loaded Records per Employee in App:');
sorted.forEach(([name, count]) => {
  console.log(`${name}: ${count}`);
});

console.log(`\nTotal Loaded IDPs: ${dbIndividualIDPs.length}`);
