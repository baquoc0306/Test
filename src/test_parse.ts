import { rawWanekIDPTSV } from './wanek_idp_raw_data';
import { rawWanekIDPTSV_part2 } from './wanek_idp_raw_data_part2';
import { rawWanekIDPTSV_part3 } from './wanek_idp_raw_data_part3';
import { rawWanekIDPTSV_part4 } from './wanek_idp_raw_data_part4';
import { rawWanekIDPTSV_part5 } from './wanek_idp_raw_data_part5';
import { rawWanekIDPTSV_part6 } from './wanek_idp_raw_data_part6';
import { rawWanekIDPTSV_part7 } from './wanek_idp_raw_data_part7';

const parts = [
  { name: 'Part 1', data: rawWanekIDPTSV, hasHeader: true },
  { name: 'Part 2', data: rawWanekIDPTSV_part2, hasHeader: false },
  { name: 'Part 3', data: rawWanekIDPTSV_part3, hasHeader: false },
  { name: 'Part 4', data: rawWanekIDPTSV_part4, hasHeader: false },
  { name: 'Part 5', data: rawWanekIDPTSV_part5, hasHeader: false },
  { name: 'Part 6', data: rawWanekIDPTSV_part6, hasHeader: false },
  { name: 'Part 7', data: rawWanekIDPTSV_part7, hasHeader: false },
];

function lineByLineParse(text: string, hasHeader: boolean): string[][] {
  const rawLines = text.split('\n');
  const parsedRows: string[][] = [];
  
  for (let line of rawLines) {
    line = line.trim();
    if (!line) continue;
    
    // Check if it's a new row: starts with a number (Emp Code) or a tab (for empty code), or if it contains a tab
    // Let's split by tab
    const cols = line.split('\t');
    
    // If it has at least 3 tabs and the first column is a number or empty, it's likely a new row!
    const isNewRow = cols.length >= 5 && (/^\d+$/.test(cols[0]) || cols[0] === '' || cols[0] === 'Emp Code');
    
    if (isNewRow) {
      parsedRows.push(cols);
    } else {
      // It's a continuation of the last field of the last row
      if (parsedRows.length > 0) {
        const lastRow = parsedRows[parsedRows.length - 1];
        lastRow[lastRow.length - 1] += ' ' + line;
      }
    }
  }
  
  return hasHeader ? parsedRows.slice(1) : parsedRows;
}

let totalParsed = 0;
for (const part of parts) {
  const parsed = lineByLineParse(part.data, part.hasHeader);
  console.log(`${part.name} - parsed: ${parsed.length}`);
  totalParsed += parsed.length;
}

console.log('Total Line-by-Line Parsed records from 7 parts:', totalParsed);
