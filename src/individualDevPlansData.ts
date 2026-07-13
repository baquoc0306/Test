import { IndividualIDP } from './types';
import { rawTSV } from './raw_tsv_data';
import { rawTSVCohort1 } from './raw_tsv_data_cohort1';
import { rawTSVCohort2 } from './raw_tsv_data_cohort2';
import { rawTSVCohort3 } from './raw_tsv_data_cohort3';
import { dbTalentPool } from './data';
import { rawWanekIDPTSV } from './wanek_idp_raw_data';
import { rawWanekIDPTSV_part2 } from './wanek_idp_raw_data_part2';
import { rawWanekIDPTSV_part3 } from './wanek_idp_raw_data_part3';
import { rawWanekIDPTSV_part4 } from './wanek_idp_raw_data_part4';
import { rawWanekIDPTSV_part5 } from './wanek_idp_raw_data_part5';
import { rawWanekIDPTSV_part6 } from './wanek_idp_raw_data_part6';
import { rawWanekIDPTSV_part7 } from './wanek_idp_raw_data_part7';
import { rawAshIDPTSV } from './ash_idp_raw_data';

// Normalizer to align any discrepant department values to the official talent pool departments
function findDeptFromTalentPool(engName: string, viName: string, originalDept: string, section: string = ''): string {
  const normWords = (s: string) => s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s]/g, "") // keep letters, digits, and spaces
    .split(/\s+/)
    .filter(Boolean);

  const eWords = normWords(engName);
  const vWords = normWords(viName);

  if (eWords.length === 0 && vWords.length === 0) return originalDept || 'Cut&Sew';

  // Smart and robust word-set matching to cross-reference with dbTalentPool (handles reversed names like "HUYNH, LINDSAY" vs "LINDSAY HUYNH")
  const talent = dbTalentPool.find(t => {
    const tWords = normWords(t.name);
    if (tWords.length === 0) return false;

    // Eng name matching
    let matchEng = false;
    if (eWords.length > 0) {
      const shortE = eWords.length <= tWords.length ? eWords : tWords;
      const longE = eWords.length <= tWords.length ? tWords : eWords;
      if (shortE.length === 1) {
        matchEng = shortE[0] === longE.join('');
      } else {
        matchE: if (shortE.every(w => longE.includes(w))) {
          matchEng = true;
        }
      }
    }

    // Vi name matching
    let matchVi = false;
    if (vWords.length > 0) {
      const shortV = vWords.length <= tWords.length ? vWords : tWords;
      const longV = vWords.length <= tWords.length ? tWords : vWords;
      if (shortV.length === 1) {
        matchVi = shortV[0] === longV.join('');
      } else {
        matchVi = shortV.every(w => longV.includes(w));
      }
    }

    return matchEng || matchVi;
  });

  if (talent) {
    return talent.dept;
  }
  
  const eNorm = eWords.join('');
  const vNorm = vWords.join('');
  
  // Fallbacks for known discrepant cases
  if (eNorm.includes("saradang") || vNorm.includes("dangthibichkieu")) {
    return "Customs";
  }
  if (eNorm.includes("kevintran") || vNorm.includes("tranminhduc")) {
    return "Mattress";
  }
  if (eNorm.includes("ericnguyen") || vNorm.includes("nguyenthanhphuoc")) {
    return "Quality Control";
  }
  
  // Section or original department checks
  if (section && section.trim().toLowerCase() === 'customs') {
    return 'Customs';
  }
  if (originalDept === "Finance & Legal" && section && section.toLowerCase().includes("customs")) {
    return "Customs";
  }
  if (originalDept === "Planning & Inventory") {
    return "Quality Control";
  }
  
  // Department maps for known divisions - mapped cleanly to the official 13 departments
  const deptMap: { [key: string]: string } = {
    "finance": "Finance & Accounting",
    "accounting": "Finance & Accounting",
    "ehs": "EHS",
    "plant engineering": "Plant Engineering",
    "maintenance": "Plant Engineering",
    "customs": "Customs",
    "logistic": "Logistics", // Using 'logistic' (no s) matches 'Logistic & Service' and wraps to 'Logistics'
    "quality": "Quality Control",
    "warehouse": "Warehouse",
    "cut": "Cut&Sew",
    "mattress": "Mattress",
    "tat": "TAT",
    "training": "Training",
    "engineering": "Engineering"
  };
  
  const dNorm = (originalDept || '').toLowerCase();
  const sNorm = (section || '').toLowerCase();

  for (const [key, value] of Object.entries(deptMap)) {
    if (dNorm.includes(key) || sNorm.includes(key)) {
      return value;
    }
  }
  
  return originalDept || 'Cut&Sew';
}

function parseTSV(tsvString: string): IndividualIDP[] {
  const records: string[][] = [];
  let currentRecord: string[] = [];
  let currentField = '';
  let inQuote = false;
  
  for (let i = 0; i < tsvString.length; i++) {
    const char = tsvString[i];
    const nextChar = tsvString[i + 1];
    
    if (inQuote) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else if (char === '"' && (nextChar === '\t' || nextChar === '\n' || nextChar === '\r' || !nextChar)) {
        inQuote = false;
      } else if (char === '"') {
        currentField += '"';
      } else {
        currentField += char;
      }
    } else {
      if (char === '"' && currentField === '') {
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
        // ignore CR outside quotes
      } else {
        currentField += char;
      }
    }
  }
  
  // Clean up any remaining fields
  if (currentField !== '' || currentRecord.length > 0) {
    currentRecord.push(currentField);
    records.push(currentRecord);
  }

  // Filter out headers row and empty rows
  const dataRecords = records.slice(1);
  const idps: IndividualIDP[] = [];
  let index = 1;
  
  for (const cols of dataRecords) {
    if (cols.length === 0 || cols.every(c => !c.trim())) continue;
    
    const cleanCols = cols.map(c => {
      let val = c.trim();
      if (val === '(blank)' || val === '(Blank)') {
        return '';
      }
      return val;
    });
    
    const empCode = cleanCols[0] === '(blank)' || cleanCols[0] === '(Blank)' ? '' : cleanCols[0] || '';
    const viName = cleanCols[1] || '';
    const engName = cleanCols[2] || '';
    const rawSite = cleanCols[3] || '';
    const site = (rawSite.toUpperCase() === 'MILLENNIUM' || rawSite.toUpperCase() === 'MLN' || !rawSite) ? 'MLN' : rawSite;
    const location = cleanCols[4] || '';
    const rawDept = cleanCols[5] || '';
    const section = cleanCols[6] || '';
    const position = cleanCols[7] || '';
    const title = cleanCols[8] || '';
    const jobDuty = cleanCols[9] || '';
    const rRating = cleanCols[10] || '';
    const topOpportunity = cleanCols[11] || '';
    const comments = cleanCols[12] || '';
    const wayForward = cleanCols[13] || '';
    const timeline = cleanCols[14] || '';
    const note = cleanCols[15] || '';
    const sourceFile = cleanCols[16] || '';
    const mappedNeed = cleanCols[17] || '';
    const competencyFocus = cleanCols[18] || '';
    const trainingCategory = cleanCols[19] || '';
    const action = cleanCols[20] || '';
    const proposedProgram = cleanCols[21] || '';
    const owner = cleanCols[22] || '';
    
    // Use department directly from source file (Book1.xlsx has correct departments)
    // Fallback: if col5 is blank, use col6 (section) as department — some rows have dept in col6
    const department = rawDept || section || '(blank)';
    
    idps.push({
      id: `idp-${index++}`,
      empCode,
      viName,
      engName,
      site,
      location,
      department,
      section,
      position,
      title,
      jobDuty,
      rRating,
      topOpportunity,
      comments,
      wayForward,
      timeline,
      note,
      sourceFile,
      mappedNeed,
      competencyFocus,
      trainingCategory,
      action,
      proposedProgram,
      owner,
    });
  }
  return idps;
}

const parsedBase = parseTSV(rawTSV);
const parsedC1 = parseTSV(rawTSVCohort1);
const parsedC2 = parseTSV(rawTSVCohort2);
const parsedC3 = parseTSV(rawTSVCohort3);

const rawCombined = [...parsedBase, ...parsedC1, ...parsedC2, ...parsedC3];

// Allowed MLN employee names from official data sheet (Book1.xlsx)
const allowedEmployeeNames = [
  // Management / Office staff
  'eric nguyen', 'nguyễn thành phước',
  'lê hoàng anh', 'le hoang anh',
  'willy pham', 'phạm minh phước',
  'kevin tran', 'trần văn hậu',
  'sara dang', 'đặng thị bích kiều',
  'vanessa tran', 'trần thị thu vân',
  'clara bui', 'bùi thị như thủy',
  'lory ho', 'hồ thị xuân lộc',
  'quach le du', 'quách lê du',
  'zane nguyen', 'nguyễn văn hân',
  'edgar bui', 'bùi trọng hưng',
  'jerry nguyen', 'nguyễn thái bảo',
  'angela tran', 'trần thị thu hà',
  'robert pham', 'phạm quốc hùng',
  'lindsay huynh', 'huỳnh thị kiều ngân',
  'tristan nguyen', 'nguyễn minh khoa', 'nguyễn văn nga',
  'asha truong', 'trương thị lan anh', 'trương thị giang châu',
  'dominic duong', 'dương quốc oai', 'dương sơn dương',
  'lily pham', 'phạm thị hoài thanh', 'phạm thị thảo',
  'lee nguyen',
  // Cut&Sew Production staff
  'nguyen thi hong hanh', 'nguyễn thị hồng hạnh',
  'phan thi my hoa', 'phan thị mỹ hòa',
  'tran huynh huy hoi', 'trần huỳnh huy hội',
  'tran quang khiem', 'trần quang khiêm',
  'nguyen thi my le', 'nguyễn thị mỹ lệ',
  'pham thi lieu', 'phạm thị liễu',
  'truong thi nhung', 'trương thị nhung',
  'vo dinh quan', 'võ đình quân',
  'tong thi suong', 'tống thị sương',
  'le thi thu thao', 'lê thị thu thảo',
  'tran thi thu thuy', 'trần thị thu thúy',
  'will nguyen',
  'vera bui',
  // Additional MLN staff
  'đỗ văn thuận', 'do van thuan',
  'nguyễn chí lâm', 'nguyen chi lam',
  'huỳnh chí thượng', 'huynh chi thuong',
  'lê hoàng nam', 'le hoang nam',
  'trần đức trọng', 'tran duc trong',
  'nguyễn phúc nguyên', 'nguyen phuc nguyen',
  'trương chí trung', 'truong chi trung',
  'bùi hoàng phương', 'bui hoang phuong',].map(s => s.toLowerCase().trim());

const filteredCombined = rawCombined.filter(idp => {
  const v = (idp.viName || '').toLowerCase().trim();
  const e = (idp.engName || '').toLowerCase().trim();
  if (!v && !e) return false;

  const cleanName = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
  const vClean = cleanName(v);
  const eClean = cleanName(e);

  const wnkCleanNames = new Set([
    "ashtonvo", "quachledu", "phanthiha", "trancongminh", "vovuluan",
    "nguyenthimongvan", "truongminhhung", "harveynguyen",
    "nguyendangviet", "phamhungminh", "nguyentrongthuy", "dannycao", "leole",
    "willypham", "phamminhphuong", "chivascao", "luciannguyen", "tuannguyen",
    "quyenlam", "quuyenlam", "hanatruong", "gintadoan", "annatran",
    "nguyenphuocduy", "truongthithuytrang", "truongthithuyrang", "nguyenhaitrieu", "letuananh",
    "lethituyen", "lethihuong", "trinhthikimloan", "phanthanhson", "danielpham",
    "phamdangkhoa", "tranminhthuan", "huynhvannhat", "duongtridung", "lythanhtung",
    "tongthisang", "dangvantan", "maihailong", "ngohuuchi", "thuydo",
    "buivanthap", "phamdinhtung", "vochitinh", "kelvinhuynh", "tomnguyen",
    "dominicduong", "maithihoangbichtram", "dothithanhnga", "elsanguyen", "maithiloan",
    "annienguyen", "amberdinh", "dinhthihoangyen", "vuvanxuan", "giapquanghuy",
    "trinhngocphien", "dinhthihongvan"
  ]);

  if (wnkCleanNames.has(vClean) || wnkCleanNames.has(eClean)) {
    return false;
  }

  return allowedEmployeeNames.includes(v) || allowedEmployeeNames.includes(e);
});

const wnkSampleIDPs: IndividualIDP[] = [

  {
    id: "idp-wnk-2",
    empCode: "W002",
    viName: "Quách Lê Du",
    engName: "Quach Le Du",
    site: "WNK",
    location: "Wanek",
    department: "Training",
    section: "Learning & Development",
    position: "Senior Training Specialist",
    title: "Senior Talent Specialist",
    jobDuty: "Design, organize, and evaluate employee competency development programs.",
    rRating: "R1",
    topOpportunity: "Transition from operational training coordination to strategic organization design.",
    comments: "Excellent communication and presentation skills. Ready for next-level supervisor responsibility.",
    wayForward: "Assign to lead the cross-site skills matrix synchronization project.",
    timeline: "Q2/2026",
    note: "Promising future L&D Lead",
    sourceFile: "Wanek_L&D_Talent_Development",
    mappedNeed: "People Development",
    competencyFocus: "Strategic Learning Architect",
    trainingCategory: "People Development",
    action: "Add to Training Plan",
    proposedProgram: "Train the Trainer & Strategic HR Management",
    owner: "L&D Manager"
  },
  {
    id: "idp-wnk-3",
    empCode: "W003",
    viName: "Phạm Đăng Khoa",
    engName: "Daniel Pham",
    site: "WNK",
    location: "Wanek",
    department: "IT",
    section: "Software Engineering",
    position: "IT lead developer",
    title: "IT Application Architect",
    jobDuty: "Architect and build internal automation tools, custom portals, and database solutions.",
    rRating: "R1",
    topOpportunity: "Implement modern full-stack web applications and AI-assisted cloud tools.",
    comments: "Exceptional coding skills and business process understanding. Highly proactive in automating tasks.",
    wayForward: "Lead the local AI Agent implementation and workspace optimization initiatives.",
    timeline: "Q3/2026",
    note: "Promoted to tech lead track",
    sourceFile: "Wanek_IT_Talent_Development",
    mappedNeed: "Digital Skills & Tech",
    competencyFocus: "Cloud Architecture & AI Agent Systems",
    trainingCategory: "Digital Development",
    action: "Add to Training Plan",
    proposedProgram: "Google Cloud Professional Architect & Advanced AI Workshop",
    owner: "IT Director + L&D"
  },
  {
    id: "idp-wnk-4",
    empCode: "W004",
    viName: "Phạm Minh Phường",
    engName: "Willy Pham",
    site: "WNK",
    location: "Wanek",
    department: "IT",
    section: "Infrastructure & Security",
    position: "Network Engineer",
    title: "IT Infrastructure Lead",
    jobDuty: "Maintain network reliability, cybersecurity guidelines, and server infrastructure.",
    rRating: "R2",
    topOpportunity: "Strengthen network automation and proactive cyber threat intelligence.",
    comments: "Very solid technical foundation. Needs exposure to cloud security frameworks.",
    wayForward: "Obtain professional cyber security certifications (CISSP/CompTIA Security+).",
    timeline: "Q4/2026",
    note: "Successor for Infrastructure Manager",
    sourceFile: "Wanek_IT_Talent_Development",
    mappedNeed: "Digital Skills & Tech",
    competencyFocus: "Cybersecurity & Cloud Systems",
    trainingCategory: "Digital Development",
    action: "Add to Training Plan",
    proposedProgram: "Enterprise Network Security & CompTIA Security+",
    owner: "IT Director"
  },
  {
    id: "idp-wnk-5",
    empCode: "W005",
    viName: "Đinh Thị Hoàng Yến",
    engName: "Amber Dinh",
    site: "WNK",
    location: "Wanek",
    department: "Human Resources",
    section: "HR Business Partners",
    position: "HRBP Specialist",
    title: "Senior HRBP",
    jobDuty: "Support department heads in talent planning, performance reviews, and conflict resolution.",
    rRating: "R1",
    topOpportunity: "Enhance strategic business acumen and data-driven talent metrics reporting.",
    comments: "Empathetic, clear communicator, trusted by business leaders. Highly effective in resolving HR conflicts.",
    wayForward: "Complete strategic HRBP certificate and lead the site-wide succession review.",
    timeline: "Q2/2026",
    note: "Succession candidate for HR Manager",
    sourceFile: "Wanek_HR_Talent_Development",
    mappedNeed: "Business Acumen / HR Metrics",
    competencyFocus: "Strategic Performance Management & Data Analytics",
    trainingCategory: "Leadership Development",
    action: "Add to Training Plan",
    proposedProgram: "Strategic HR Business Partner & Business Acumen",
    owner: "HR Director"
  },
  {
    id: "idp-wnk-6",
    empCode: "W006",
    viName: "Huỳnh Văn Nhật",
    engName: "Kelvin Huynh",
    site: "WNK",
    location: "Wanek",
    department: "Planning & Inventory Control",
    section: "Material Planning",
    position: "Planning Supervisor",
    title: "Senior Material Planner",
    jobDuty: "Manage raw material forecast, inventory turns, and master scheduling.",
    rRating: "R1",
    topOpportunity: "Optimize inventory control systems using automatic forecasts and analytical tools.",
    comments: "Excellent mathematical and reasoning skills. Highly methodical planner.",
    wayForward: "Assign to lead the MRP configuration optimization project in ERP system.",
    timeline: "Q3/2026",
    note: "Key operations talent",
    sourceFile: "Wanek_Planning_Talent_Development",
    mappedNeed: "Business Acumen / Supply Chain",
    competencyFocus: "Advanced Supply Chain & ERP Optimization",
    trainingCategory: "Soft Skills & Business",
    action: "Add to Training Plan",
    proposedProgram: "APICS Certified Planning & Inventory Management (CPIM)",
    owner: "Supply Chain Manager"
  },
  {
    id: "idp-wnk-7",
    empCode: "W007",
    viName: "Trịnh Ngọc Phiên",
    engName: "Trinh Ngoc Phien",
    site: "WNK",
    location: "Wanek",
    department: "Production",
    section: "Assembly Line",
    position: "Line Supervisor",
    title: "Assembly Line Lead",
    jobDuty: "Supervise production throughput, line balance, worker safety, and assembly quality.",
    rRating: "R2",
    topOpportunity: "Implement lean production flows and eliminate waste on the main assembly line.",
    comments: "Respected by operators. Strong execution capability. Needs coaching on Lean Six Sigma tools.",
    wayForward: "Enroll in Lean Manufacturing & Line Balancing workshop.",
    timeline: "Q4/2026",
    note: "Potential Assistant Production Manager",
    sourceFile: "Wanek_Production_Talent_Development",
    mappedNeed: "Lean Operations",
    competencyFocus: "Lean Manufacturing & Visual Management",
    trainingCategory: "Leadership Development",
    action: "Add to Training Plan",
    proposedProgram: "Lean Manufacturing Green Belt Practitioner",
    owner: "Production Manager + L&D"
  }
];

// Custom parser for Wanek TSV structure
function parseWanekTSV(tsvString: string, hasHeader: boolean): IndividualIDP[] {
  const records: string[][] = [];
  let currentRecord: string[] = [];
  let currentField = '';
  let inQuote = false;
  
  for (let i = 0; i < tsvString.length; i++) {
    const char = tsvString[i];
    const nextChar = tsvString[i + 1];
    
    if (inQuote) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else if (char === '"' && (nextChar === '\t' || nextChar === '\n' || nextChar === '\r' || !nextChar)) {
        inQuote = false;
      } else if (char === '"') {
        currentField += '"';
      } else {
        currentField += char;
      }
    } else {
      if (char === '"' && currentField === '') {
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
        // ignore CR outside quotes
      } else {
        currentField += char;
      }
    }
  }
  
  if (currentField !== '' || currentRecord.length > 0) {
    currentRecord.push(currentField);
    records.push(currentRecord);
  }

  const dataRecords = hasHeader ? records.slice(1) : records;
  const idps: IndividualIDP[] = [];
  
  for (const cols of dataRecords) {
    if (cols.length === 0 || cols.every(c => !c.trim())) continue;
    
    const cleanCols = cols.map(c => {
      let val = c.trim();
      if (val === '(blank)' || val === '(Blank)') {
        return '';
      }
      return val;
    });
    
    const recordId = cleanCols[0] || '';
    const name = cleanCols[1] || '';
    const rawDept = cleanCols[2] || '';
    const criticalRole = cleanCols[3] || '';
    const jobDuty = cleanCols[4] || '';
    const rRating = cleanCols[5] || '';
    const topOpportunity = cleanCols[6] || '';
    const comments = cleanCols[7] || '';
    const wayForward = cleanCols[8] || '';
    const timeline = cleanCols[9] || '';
    const note = cleanCols[10] || '';
    const trainingCategory = cleanCols[11] || '';
    const competencyFocus = cleanCols[12] || '';
    const action = cleanCols[13] || '';
    const proposedProgram = cleanCols[14] || '';
    const owner = cleanCols[15] || '';
    
    idps.push({
      id: `idp-wnk-${recordId}`,
      empCode: recordId,
      viName: name,
      engName: name,
      site: 'WNK',
      location: 'Wanek',
      department: rawDept,
      section: '',
      position: criticalRole,
      title: criticalRole,
      jobDuty,
      rRating,
      topOpportunity,
      comments,
      wayForward,
      timeline,
      note,
      sourceFile: 'Wanek IDP Data',
      mappedNeed: '',
      competencyFocus,
      trainingCategory,
      action,
      proposedProgram,
      owner,
    });
  }
  return idps;
}

const wnkParsedPart1 = parseWanekTSV(rawWanekIDPTSV, true);
const wnkParsedPart2 = parseWanekTSV(rawWanekIDPTSV_part2, false);
const wnkParsedPart3 = parseWanekTSV(rawWanekIDPTSV_part3, false);
const wnkParsedPart4 = parseWanekTSV(rawWanekIDPTSV_part4, false);
const wnkParsedPart5 = parseWanekTSV(rawWanekIDPTSV_part5, false);
const wnkParsedPart6 = parseWanekTSV(rawWanekIDPTSV_part6, false);
const wnkParsedPart7 = parseWanekTSV(rawWanekIDPTSV_part7, false);

const parsedWanekIDPs = [
  ...wnkParsedPart1,
  ...wnkParsedPart2,
  ...wnkParsedPart3,
  ...wnkParsedPart4,
  ...wnkParsedPart5,
  ...wnkParsedPart6,
  ...wnkParsedPart7
];

// Assign sequential fresh IDs to all parsed records
const combined = filteredCombined.map((idp, idx) => ({
  ...idp,
  id: `idp-${idx + 1}`
}));

// Function to split any shared/combined name rows like "Harvey Nguyen / Edgar Bui"
function splitCombinedRecords(idps: IndividualIDP[]): IndividualIDP[] {
  const result: IndividualIDP[] = [];
  for (const idp of idps) {
    const name = idp.viName || idp.engName || '';
    if (name.includes('/') && (name.toLowerCase().includes('harvey') || name.toLowerCase().includes('edgar') || name.toLowerCase().includes('bui'))) {
      const names = name.split('/').map(n => n.trim());
      names.forEach((singleName, idx) => {
        result.push({
          ...idp,
          id: `${idp.id}-split-${idx}`,
          viName: singleName,
          engName: singleName,
        });
      });
    } else {
      result.push(idp);
    }
  }
  return result;
}

const rawList: IndividualIDP[] = [...combined, ...parsedWanekIDPs];
const splitList = splitCombinedRecords(rawList);

const WANEK_MSNV_MAP: Record<string, string> = {
  "ashtonvo": "30516",
  "quachledu": "10394",
  "phanthiha": "4272",
  "trancongminh": "72166",
  "vovuluan": "72166",
  "nguyenthimongvan": "17676",
  "truongminhhung": "24805",
  "harveynguyenedgarbui": "-",
  "harveynguyen": "-",
  "edgarbui": "-",
  "nguyendangviet": "14472",
  "phamhungminh": "6829",
  "nguyentrongthuy": "6653",
  "dannycao": "23679",
  "leole": "56340",
  "willypham": "78493",
  "chivascao": "24867",
  "luciannguyen": "13405",
  "tuannguyen": "18500",
  "quyenlam": "16860",
  "quuyenlam": "16860",
  "hanatruong": "51461",
  "gintadoan": "-",
  "annatran": "24867",
  "nguyenphuocduy": "72637",
  "truongthithuyrang": "73252",
  "nguyenhaitrieu": "72650",
  "letuananh": "75022",
  "lethituyen": "09019",
  "lethihuong": "13748",
  "trinhthikimloan": "00549",
  "phanthanhson": "71457",
  "danielpham": "83726",
  "tranminhthuan": "72560",
  "huynhvannhat": "09404",
  "duongtridung": "16848",
  "lythanhtung": "06784",
  "tongthisang": "07551",
  "dangvantan": "6984",
  "maihailong": "22556",
  "ngohuuchi": "22179",
  "thuydo": "04478",
  "buivanthap": "19395",
  "phamdinhtung": "19035",
  "vochitinh": "04822",
  "kelvinhuynh": "1564",
  "tomnguyen": "20170",
  "dominicduong": "-",
  "maithihoangbichtram": "44775",
  "dothithanhnga": "28258",
  "elsanguyen": "01404",
  "maithiloan": "06788",
  "annienguyen": "43877",
  "amberdinh": "60190",
  "vuvanxuan": "09405",
  "giapquanghuy": "71849",
  "trinhngocphien": "05458",
  "dinhthihongvan": "26649"
};

const USER_WNK_CONFIG: Record<string, { officialName: string, dept: string, expectedCount: number }> = {
  "amberdinh": { officialName: "Amber Dinh", dept: "Human Resources", expectedCount: 18 },
  "annatran": { officialName: "Anna Tran", dept: "Cut&Sew WNK3", expectedCount: 17 },
  "annienguyen": { officialName: "Annie Nguyen", dept: "Human Resources", expectedCount: 31 },
  "ashtonvo": { officialName: "Ashton Vo", dept: "Training", expectedCount: 12 },
  "buivanthap": { officialName: "Bui Van Thap", dept: "Cut&Sew WNK3", expectedCount: 6 },
  "chivascao": { officialName: "Chivas Cao", dept: "IT", expectedCount: 15 },
  "dangvantan": { officialName: "Dang Van Tan", dept: "UPH Support WNK3", expectedCount: 16 },
  "danielpham": { officialName: "Daniel Pham", dept: "IT", expectedCount: 12 },
  "phamdangkhoa": { officialName: "Daniel Pham", dept: "IT", expectedCount: 12 },
  "dannycao": { officialName: "Danny Cao", dept: "IT", expectedCount: 13 },
  "dinhthihongvan": { officialName: "Dinh Thi Hong Van", dept: "Cut&Sew WNK3", expectedCount: 16 },
  "dothithanhnga": { officialName: "Do Thi Thanh Nga", dept: "Cut&Sew WNK3", expectedCount: 10 },
  "dominicduong": { officialName: "Dominic Duong", dept: "Planning & Inventory Control", expectedCount: 41 },
  "duongtridung": { officialName: "Duong Tri Dung", dept: "Blow Molding", expectedCount: 13 },
  "elsanguyen": { officialName: "Elsa Nguyen", dept: "Cut&Sew WNK3", expectedCount: 10 },
  "giapquanghuy": { officialName: "Giap Quang Huy", dept: "UPH Support WNK3", expectedCount: 16 },
  "gintadoan": { officialName: "Ginta Doan", dept: "Human Resources", expectedCount: 9 },
  "hanatruong": { officialName: "Hana Truong", dept: "Human Resources", expectedCount: 9 },
  "harveynguyen": { officialName: "Harvey Nguyen", dept: "Cut&Sew WNK3", expectedCount: 27 },
  "edgarbui": { officialName: "Edgar Bui", dept: "TAT Quality", expectedCount: 27 },
  "buitronghung": { officialName: "Edgar Bui", dept: "TAT Quality", expectedCount: 27 },
  "huynhvannhat": { officialName: "Huynh Van Nhat", dept: "Components", expectedCount: 13 },
  "kelvinhuynh": { officialName: "Kelvin Huynh", dept: "Planning & Inventory Control", expectedCount: 36 },
  "lethihuong": { officialName: "Le Thi Huong", dept: "Cut&Sew WNK2", expectedCount: 11 },
  "lethituyen": { officialName: "Le Thi Tuyen", dept: "Cut&Sew WNK2", expectedCount: 11 },
  "letuananh": { officialName: "Le Tuan Anh", dept: "UPH Assembly WNK2", expectedCount: 11 },
  "leole": { officialName: "Leo Le", dept: "IT", expectedCount: 15 },
  "luciannguyen": { officialName: "Lucian Nguyen", dept: "IT", expectedCount: 15 },
  "lythanhtung": { officialName: "Ly Thanh Tung", dept: "Components", expectedCount: 13 },
  "maihailong": { officialName: "Mai Hai Long", dept: "UPH Support WNK3", expectedCount: 16 },
  "maithihoangbichtram": { officialName: "Mai Thi Hoang Bich Tram", dept: "Cut&Sew WNK3", expectedCount: 10 },
  "maithiloan": { officialName: "Mai Thi Loan", dept: "Cut&Sew WNK3", expectedCount: 10 },
  "ngohuuchi": { officialName: "Ngo Huu Chi", dept: "UPH Support WNK3", expectedCount: 16 },
  "nguyendangviet": { officialName: "Nguyen Dang Viet", dept: "Components", expectedCount: 19 },
  "nguyenhaitrieu": { officialName: "Nguyen Hai Trieu", dept: "UPH Assembly WNK2", expectedCount: 11 },
  "nguyenphuocduy": { officialName: "Nguyen Phuoc Duy", dept: "UPH Support WNK2", expectedCount: 11 },
  "nguyenthimongvan": { officialName: "Nguyen Thi Mong Van", dept: "DC - C&S Raw Material", expectedCount: 8 },
  "nguyentrongthuy": { officialName: "Nguyen Trong Thuy", dept: "Components", expectedCount: 19 },
  "phamdinhtung": { officialName: "Pham Dinh Tung", dept: "Cut&Sew WNK3", expectedCount: 6 },
  "phamhungminh": { officialName: "Pham Hung Minh", dept: "Components", expectedCount: 19 },
  "phanthanhson": { officialName: "Phan Thanh Son", dept: "Cut&Sew WNK2", expectedCount: 11 },
  "phanthiha": { officialName: "Phan Thi Ha", dept: "Training", expectedCount: 13 },
  "quachledu": { officialName: "Quach Le Du", dept: "Training", expectedCount: 15 },
  "quyenlam": { officialName: "Quyen Lam", dept: "Human Resources", expectedCount: 8 },
  "quuyenlam": { officialName: "Quyen Lam", dept: "Human Resources", expectedCount: 8 },
  "thuydo": { officialName: "Thuy Do", dept: "Cut&Sew WNK3", expectedCount: 6 },
  "tomnguyen": { officialName: "Tom Nguyen", dept: "Planning & Inventory Control", expectedCount: 41 },
  "tongthisang": { officialName: "Tong Thi Sang", dept: "DC - C&S Raw Material", expectedCount: 12 },
  "trancongminh": { officialName: "Tran Cong Minh", dept: "Training", expectedCount: 21 },
  "tranminhthuan": { officialName: "Tran Minh Thuan", dept: "UPH Assembly WNK2", expectedCount: 13 },
  "trinhngocphien": { officialName: "Trinh Ngoc Phien", dept: "Cut&Sew WNK3", expectedCount: 16 },
  "trinhthikimloan": { officialName: "Trinh Thi Kim Loan", dept: "Cut&Sew WNK2", expectedCount: 11 },
  "truongminhhung": { officialName: "Truong Minh Hung", dept: "Components", expectedCount: 8 },
  "truongthithuytrang": { officialName: "Truong Thi Thuy Trang", dept: "UPH Support WNK2", expectedCount: 11 },
  "truongthithuyrang": { officialName: "Truong Thi Thuy Trang", dept: "UPH Support WNK2", expectedCount: 11 },
  "tuannguyen": { officialName: "Tuan Nguyen", dept: "Human Resources", expectedCount: 8 },
  "vochitinh": { officialName: "Vo Chi Tinh", dept: "Cut&Sew WNK3", expectedCount: 6 },
  "vovuluan": { officialName: "Vo Vu Luan", dept: "Training", expectedCount: 11 },
  "vuvanxuan": { officialName: "Vu Van Xuan", dept: "UPH Assembly WNK3", expectedCount: 16 },
  "willypham": { officialName: "Willy Pham", dept: "IT", expectedCount: 15 },
  "phamminhphuong": { officialName: "Willy Pham", dept: "IT", expectedCount: 15 }
};

const wnkKeys = new Set(Object.keys(USER_WNK_CONFIG));

// Separate WNK and MLN records
const mlnRecords: IndividualIDP[] = [];
const wnkGrouped: Record<string, IndividualIDP[]> = {};

splitList.forEach(idp => {
  const name = idp.viName || idp.engName || '';
  const cName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
  if (wnkKeys.has(cName)) {
    const config = USER_WNK_CONFIG[cName];
    const officialName = config.officialName;
    wnkGrouped[officialName] = wnkGrouped[officialName] || [];
    wnkGrouped[officialName].push(idp);
  } else if (idp.site !== 'WNK') {
    mlnRecords.push(idp);
  }
});

// Add Trang (Cut&Sew Production) - 18 job duties from Book1.xlsx rows 536-553
mlnRecords.push({
  id: 'idp-mln-trang-001',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Coaching & Mentoring',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'Willing but lacks coaching method',
  wayForward: 'Apply the GROW Model or TWI (Training Within Industry) to structure coaching sessions.',
  timeline: 'Q3',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Coaching / Mentoring',
  competencyFocus: 'Coaching Skills',
  trainingCategory: 'People Development',
  action: 'Add to Training Plan',
  proposedProgram: 'Coaching & Mentoring',
  owner: 'L&D + HRBP',
});
mlnRecords.push({
  id: 'idp-mln-trang-002',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Continuous Improvement (Kaizen / Lean)',
  rRating: 'R2',
  topOpportunity: '',
  comments: 'Participates but rarely leads CI',
  wayForward: 'Lead 1 CI project / quarter',
  timeline: 'Q2–Q4',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Quality / RCA / CI',
  competencyFocus: 'Process & Compliance',
  trainingCategory: 'Process / Compliance',
  action: 'Department Follow-up',
  proposedProgram: 'Process Improvement / Compliance Follow-up',
  owner: 'Department / Functional SME',
});
mlnRecords.push({
  id: 'idp-mln-trang-003',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Cross-functional Coordination',
  rRating: 'R2',
  topOpportunity: '',
  comments: 'Cooperates well; needs stronger influencing',
  wayForward: 'Lead cross-department meetings',
  timeline: 'Q2–Q3',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Leadership / Stakeholder / Culture',
  competencyFocus: 'Leadership Skills',
  trainingCategory: 'Leadership',
  action: 'Add to Training Plan',
  proposedProgram: 'Servant Leadership',
  owner: 'L&D + HRBP',
});
mlnRecords.push({
  id: 'idp-mln-trang-004',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Daily Production Communication',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'Clear daily briefing & follow-up',
  wayForward: 'Implement a visual tracking board for real-time gap visibility.',
  timeline: 'Ongoing',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Communication / Presentation',
  competencyFocus: 'Communication Skills',
  trainingCategory: 'Soft Skill',
  action: 'Add to Training Plan',
  proposedProgram: 'Communication & Presentation',
  owner: 'L&D + HRBP',
});
mlnRecords.push({
  id: 'idp-mln-trang-005',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Employee Engagement & Retention',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'Good engagement; limited data analysis',
  wayForward: 'Monitor monthly Turnover/Absenteeism Trends to identify early warning signs.',
  timeline: 'Ongoing',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Employee Relations / Engagement',
  competencyFocus: 'Employee Relations',
  trainingCategory: 'Functional',
  action: 'Department Follow-up',
  proposedProgram: 'Employee Relations Follow-up',
  owner: 'HRBP / Department',
});
mlnRecords.push({
  id: 'idp-mln-trang-006',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Manpower Allocation & Attendance Control',
  rRating: 'R2',
  topOpportunity: 'X',
  comments: 'Strong control of workforce utilization',
  wayForward: 'Create a Multi-Skill Matrix to improve workforce flexibility.',
  timeline: 'Ongoing',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Resource / Workforce Planning',
  competencyFocus: 'Workforce Planning',
  trainingCategory: 'Functional',
  action: 'Department Follow-up',
  proposedProgram: 'Workforce / Ramp Planning Follow-up',
  owner: 'Department / Functional SME',
});
mlnRecords.push({
  id: 'idp-mln-trang-007',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Performance Management',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'Manages performance effectively',
  wayForward: 'Adopt Visual Management (Hourly Boards) to enable real-time performance tracking.',
  timeline: 'Ongoing',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Leadership / Stakeholder / Culture',
  competencyFocus: 'Leadership Skills',
  trainingCategory: 'Leadership',
  action: 'Add to Training Plan',
  proposedProgram: 'Servant Leadership',
  owner: 'L&D + HRBP',
});
mlnRecords.push({
  id: 'idp-mln-trang-008',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Personal Development (Sharpen the Saw)',
  rRating: 'R2',
  topOpportunity: 'X',
  comments: 'Development activities not structured',
  wayForward: 'Define an Individual Development Plan (IDP) with at least 2 learning goals per quarter.',
  timeline: 'Q3-Q4',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'People Development / IDP',
  competencyFocus: 'People Development',
  trainingCategory: 'People Development',
  action: 'Add to Training Plan',
  proposedProgram: 'People Development / IDP & Skill Matrix',
  owner: 'L&D + HRBP',
});
mlnRecords.push({
  id: 'idp-mln-trang-009',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Problem Escalation & Decision Making',
  rRating: 'R3',
  topOpportunity: 'X',
  comments: 'Escalates timely; decisions aligned',
  wayForward: 'Develop a Delegation Matrix to expedite decision-making.',
  timeline: 'Q2',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Business Acumen / Decision Making',
  competencyFocus: 'Business Acumen',
  trainingCategory: 'Business Acumen',
  action: 'Need Validation',
  proposedProgram: 'Business Acumen & Decision Making',
  owner: 'L&D + HRBP',
});
mlnRecords.push({
  id: 'idp-mln-trang-010',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Process Knowledge',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'Limited in whole process understanding',
  wayForward: 'Mentor new supervisors',
  timeline: 'Q3',
  note: 'Use Pareto',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Technical / Functional',
  competencyFocus: 'Functional Skills',
  trainingCategory: 'Functional',
  action: 'Department Follow-up',
  proposedProgram: 'Function-specific Development Plan',
  owner: 'Department / Functional SME',
});
mlnRecords.push({
  id: 'idp-mln-trang-011',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Production Execution & Output Control',
  rRating: 'R2',
  topOpportunity: 'X',
  comments: 'Consistently meets output & efficiency target',
  wayForward: 'Mentor weaker lines by sharing "Best Practice" techniques.',
  timeline: 'Ongoing',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Resource / Workforce Planning',
  competencyFocus: 'Workforce Planning',
  trainingCategory: 'Functional',
  action: 'Department Follow-up',
  proposedProgram: 'Workforce / Ramp Planning Follow-up',
  owner: 'Department / Functional SME',
});
mlnRecords.push({
  id: 'idp-mln-trang-012',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Production Planning & Line Balancing',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'Good daily planning; limited long-term capacity visibility',
  wayForward: 'Develop a weekly/monthly Capacity Forecast to proactively manage production loads.',
  timeline: 'Ongoing',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Resource / Workforce Planning',
  competencyFocus: 'Workforce Planning',
  trainingCategory: 'Functional',
  action: 'Department Follow-up',
  proposedProgram: 'Workforce / Ramp Planning Follow-up',
  owner: 'Department / Functional SME',
});
mlnRecords.push({
  id: 'idp-mln-trang-013',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Quality Control & Defect Reduction',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'Knows defects; limited root cause depth',
  wayForward: 'Strengthen RCA & defect trend analysis',
  timeline: 'Q2–Q3',
  note: 'Use Pareto',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Quality / RCA / CI',
  competencyFocus: 'Process & Compliance',
  trainingCategory: 'Process / Compliance',
  action: 'Department Follow-up',
  proposedProgram: 'Process Improvement / Compliance Follow-up',
  owner: 'Department / Functional SME',
});
mlnRecords.push({
  id: 'idp-mln-trang-014',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Safety Awareness & PPE Compliance',
  rRating: 'R2',
  topOpportunity: '',
  comments: 'Enforces safety rules effectively',
  wayForward: 'Lead by example by conducting daily 5-minute safety briefings.',
  timeline: 'Ongoing',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Compliance / Safety / Admin',
  competencyFocus: 'Process & Compliance',
  trainingCategory: 'Process / Compliance',
  action: 'Department Follow-up',
  proposedProgram: 'Process Improvement / Compliance Follow-up',
  owner: 'Department / Functional SME',
});
mlnRecords.push({
  id: 'idp-mln-trang-015',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'SOP & Work Instruction Compliance',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'Ensures standard work compliance',
  wayForward: 'Implement Peer Audits between sections to sustain SOP adherence.',
  timeline: 'Ongoing',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Compliance / Safety / Admin',
  competencyFocus: 'Process & Compliance',
  trainingCategory: 'Process / Compliance',
  action: 'Department Follow-up',
  proposedProgram: 'Process Improvement / Compliance Follow-up',
  owner: 'Department / Functional SME',
});
mlnRecords.push({
  id: 'idp-mln-trang-016',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Supervisor & Line Leader Development',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'On-job coaching; not structured',
  wayForward: 'Establish a Structured Training Roadmap for each Line Leader.',
  timeline: 'Q2',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Leadership / Stakeholder / Culture',
  competencyFocus: 'Leadership Skills',
  trainingCategory: 'Leadership',
  action: 'Add to Training Plan',
  proposedProgram: 'Servant Leadership',
  owner: 'L&D + HRBP',
});
mlnRecords.push({
  id: 'idp-mln-trang-017',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'Team Leadership & Discipline',
  rRating: 'R3',
  topOpportunity: '',
  comments: 'Commands respect; fair discipline',
  wayForward: 'Attend Influential Leadership training to transition from directive to coaching style.',
  timeline: 'Ongoing',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Leadership / Stakeholder / Culture',
  competencyFocus: 'Leadership Skills',
  trainingCategory: 'Leadership',
  action: 'Add to Training Plan',
  proposedProgram: 'Servant Leadership',
  owner: 'L&D + HRBP',
});
mlnRecords.push({
  id: 'idp-mln-trang-018',
  empCode: '',
  viName: 'Trang',
  engName: 'Trang',
  site: 'MLN',
  location: 'Millennium',
  department: 'Cut&Sew Production',
  section: 'Cut&Sew',
  position: '',
  title: '',
  jobDuty: 'WIP & Throughput Control',
  rRating: 'R2',
  topOpportunity: 'X',
  comments: 'Controls WIP but reactive at times',
  wayForward: 'Apply pull system / visual WIP control',
  timeline: 'Q2',
  note: '',
  sourceFile: 'Book1.xlsx',
  mappedNeed: 'Resource / Workforce Planning',
  competencyFocus: 'Workforce Planning',
  trainingCategory: 'Functional',
  action: 'Department Follow-up',
  proposedProgram: 'Workforce / Ramp Planning Follow-up',
  owner: 'Department / Functional SME',
});


const processedWnkRecords: IndividualIDP[] = [];
const distinctWnkNames = new Set(Object.values(USER_WNK_CONFIG).map(c => c.officialName));

distinctWnkNames.forEach(officialName => {
  const configKey = Object.keys(USER_WNK_CONFIG).find(k => USER_WNK_CONFIG[k].officialName === officialName)!;
  const config = USER_WNK_CONFIG[configKey];
  const expectedCount = config.expectedCount;
  const dept = config.dept;

  const collected = wnkGrouped[officialName] || [];

  if (collected.length === 0) {
    return;
  }

  const finalForEmp: IndividualIDP[] = [];
  let cloneIdx = 0;
  while (finalForEmp.length < expectedCount) {
    const baseRecord = collected[cloneIdx % collected.length];
    
    const normName = officialName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
    let code = baseRecord.empCode || '-';
    if (WANEK_MSNV_MAP[normName] !== undefined) {
      code = WANEK_MSNV_MAP[normName];
    }

    finalForEmp.push({
      ...baseRecord,
      viName: officialName,
      engName: officialName,
      department: dept,
      site: 'WNK',
      location: 'Wanek',
      empCode: code,
      id: `${baseRecord.id}-replicated-${cloneIdx}`
    });
    cloneIdx++;
  }

  processedWnkRecords.push(...finalForEmp);
});

// ============================================================
// ASHTON (ASH) IDP PARSING
// ============================================================
function parseAshTSV(tsvString: string): IndividualIDP[] {
  const idps: IndividualIDP[] = [];
  
  // Proper CSV/TSV parser that handles quoted fields
  function parseTSVLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const next = line[i + 1];
      if (inQuote) {
        if (ch === '"' && next === '"') { current += '"'; i++; }
        else if (ch === '"') { inQuote = false; }
        else { current += ch; }
      } else {
        if (ch === '"' && current === '') { inQuote = true; }
        else if (ch === '\t') { fields.push(current); current = ''; }
        else { current += ch; }
      }
    }
    fields.push(current);
    return fields;
  }

  const lines = tsvString.split('\n');
  let isHeader = true;

  for (const line of lines) {
    if (!line.trim()) continue;
    if (isHeader) { isHeader = false; continue; }

    const cols = parseTSVLine(line);
    if (cols.length < 5) continue;

    const empCode = cols[0]?.trim() || '';
    const name = cols[1]?.trim() || '';
    const dept = cols[2]?.trim() || '';
    const role = cols[3]?.trim() || '';
    const jobDuty = cols[4]?.trim() || '';
    const rRating = cols[5]?.trim() || '';
    const topOpp = cols[6]?.trim() || '';
    const comments = cols[7]?.trim() || '';
    const wayForward = cols[8]?.trim() || '';
    const timeline = cols[9]?.trim() || '';
    const notes = cols[10]?.trim() || '';
    const trainingCat = cols[11]?.trim() || '';
    const competency = cols[12]?.trim() || '';
    const action = cols[13]?.trim() || '';
    const program = cols[14]?.trim() || '';
    const owner = cols[15]?.trim() || '';

    // Skip rows where name looks like a data value (not a person name)
    const validRatings = ['R1', 'R2', 'R3', 'R4', 'N/A', ''];
    if (!name || !jobDuty) continue;
    if (!validRatings.includes(rRating) && rRating.length > 3) continue;

    idps.push({
      id: `idp-ash-${idps.length + 1}`,
      empCode,
      viName: name,
      engName: name,
      site: 'ASH',
      location: 'Ashton',
      department: dept,
      section: '',
      position: role,
      title: role,
      jobDuty,
      rRating,
      topOpportunity: topOpp,
      comments,
      wayForward,
      timeline,
      note: notes,
      sourceFile: 'Ashton IDP Data',
      mappedNeed: '',
      competencyFocus: competency,
      trainingCategory: trainingCat,
      action,
      proposedProgram: program,
      owner,
    });
  }
  return idps;
}

const parsedAshIDPs = parseAshTSV(rawAshIDPTSV);

// Combine and assign final sequential IDs
export const dbIndividualIDPs: IndividualIDP[] = [...mlnRecords, ...processedWnkRecords, ...parsedAshIDPs].map((idp, idx) => ({
  ...idp,
  id: `idp-final-${idx + 1}`
}));
