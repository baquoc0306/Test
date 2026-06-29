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
    
    // Resolve clean official department name
    const department = findDeptFromTalentPool(engName, viName, rawDept, section);
    
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

// 34 allowed employee names from the user's official data sheet + 8 missing Millennium employees
const allowedEmployeeNames = [
  'ERIC NGUYEN', 'NGUYỄN THÀNH PHƯỚC',
  'LÊ HOÀNG ANH', 'Plant Engineering',
  'WILLY PHAM', 'PHẠM MINH PHƯỜNG',
  'KEVIN TRAN', 'TRẦN VĂN HẬU',
  'SARA DANG', 'ĐẶNG THỊ BÍCH KIỀU',
  'VANESSA TRAN', 'TRẦN THỊ THU VÂN',
  'CLARA BUI', 'BÙI THỊ NHƯ THỦY',
  'LORY HO', 'HỒ THỊ XUÂN LỘC',
  'QUACH LE DU', 'QUÁCH LÊ DU',
  'ZANE NGUYEN', 'NGUYỄN VĂN HÂN',
  'EDGAR BUI', 'BÙI TRỌNG HƯNG',
  'JERRY NGUYEN', 'NGUYỄN THÁI BẢO',
  'ANGELA TRAN', 'TRẦN THỊ THU HÀ',
  'ROBERT PHAM', 'PHẠM QUỐC HÙNG',
  'LINDSAY HUYNH', 'HUỲNH THỊ KIỀU NGÂN',
  'TRISTAN NGUYEN', 'NGUYỄN MINH KHOA', 'NGUYỄN VĂN NGA',
  'ASHA TRUONG', 'TRƯƠNG THỊ LAN ANH', 'TRƯƠNG THỊ GIANG CHÂU',
  'DOMINIC DUONG', 'DƯƠNG QUỐC OAI', 'DƯƠNG SƠN DƯƠNG',
  'LILY PHAM', 'PHẠM THỊ HOÀI THANH', 'PHẠM THỊ THẢO',
  'Lee Nguyen', 'LEE NGUYEN',
  'Hạnh',
  'Hòa',
  'Hội_Huỳnh',
  'Khiêm',
  'Lệ',
  'Liễu',
  'Nhung',
  'Quân',
  'Sương',
  'Thảo_Lê',
  'Thúy',
  'Trang',
  'VERA BUI', 'Vera Bui',
  'Will',
  'ĐỔ VĂN THUẬN', 'DO VAN THUAN',
  'NGUYỄN CHÍ LÂM', 'NGUYEN CHI LAM',
  'HUỲNH CHÍ THƯỢNG', 'HUYNH CHI THUONG',
  'LÊ HOÀNG NAM', 'LE HOANG NAM',
  'TRẦN ĐỨC TRỌNG', 'TRAN DUC TRONG',
  'NGUYỄN PHÚC NGUYÊN', 'NGUYEN PHUC NGUYEN',
  'TRƯƠNG CHÍ TRUNG', 'TRUONG CHI TRUNG',
  'BÙI HOÀNG PHƯỢNG', 'BUI HOANG PHUONG'
].map(s => s.toLowerCase().trim());

const filteredCombined = rawCombined.filter(idp => {
  const v = (idp.viName || '').toLowerCase().trim();
  const e = (idp.engName || '').toLowerCase().trim();
  if (!v && !e) return false;

  const cleanName = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
  const vClean = cleanName(v);
  const eClean = cleanName(e);

  const wnkCleanNames = new Set([
    "ashtonvo", "quachledu", "phanthiha", "trancongminh", "vovuluan",
    "nguyenthimongvan", "truongminhhung", "harveynguyen", "edgarbui", "buitronghung",
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
    id: "idp-wnk-1",
    empCode: "W001",
    viName: "Bùi Trọng Hưng",
    engName: "Edgar Bui",
    site: "WNK",
    location: "Wanek",
    department: "TAT Quality",
    section: "Quality Assurance",
    position: "QA Supervisor",
    title: "Superstar QA Leader",
    jobDuty: "Lead and optimize quality inspection processes for components and TAT.",
    rRating: "R1",
    topOpportunity: "Acquire advanced digital control systems and automatic testing methodologies.",
    comments: "Edgar shows outstanding potential to lead the QA department. Needs coaching on strategic quality management.",
    wayForward: "Enroll in Advanced Quality Management & Six Sigma Black Belt training.",
    timeline: "Q3/2026",
    note: "High priority development track",
    sourceFile: "Wanek_QA_Talent_Development",
    mappedNeed: "Leadership / Advanced QA",
    competencyFocus: "Strategic Quality & Six Sigma",
    trainingCategory: "Leadership Development",
    action: "Add to Training Plan",
    proposedProgram: "Six Sigma Black Belt & Agile Leadership",
    owner: "L&D + QA Manager"
  },
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
  "chivascao": { officialName: "Chivas Cao", dept: "Cut&Sew WNK3", expectedCount: 15 },
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
  "harveynguyen": { officialName: "Harvey Nguyen / Edgar Bui", dept: "TAT Quality", expectedCount: 27 },
  "edgarbui": { officialName: "Harvey Nguyen / Edgar Bui", dept: "TAT Quality", expectedCount: 27 },
  "buitronghung": { officialName: "Harvey Nguyen / Edgar Bui", dept: "TAT Quality", expectedCount: 27 },
  "huynhvannhat": { officialName: "Huynh Van Nhat", dept: "Components", expectedCount: 13 },
  "kelvinhuynh": { officialName: "Kelvin Huynh", dept: "Planning & Inventory Control", expectedCount: 36 },
  "lethihuong": { officialName: "Le Thi Huong", dept: "Cut&Sew WNK3", expectedCount: 11 },
  "lethituyen": { officialName: "Le Thi Tuyen", dept: "Cut&Sew WNK3", expectedCount: 11 },
  "letuananh": { officialName: "Le Tuan Anh", dept: "Cut&Sew WNK3", expectedCount: 11 },
  "leole": { officialName: "Leo Le", dept: "Cut&Sew WNK3", expectedCount: 15 },
  "luciannguyen": { officialName: "Lucian Nguyen", dept: "Cut&Sew WNK3", expectedCount: 15 },
  "lythanhtung": { officialName: "Ly Thanh Tung", dept: "Blow Molding", expectedCount: 13 },
  "maihailong": { officialName: "Mai Hai Long", dept: "UPH Support WNK3", expectedCount: 16 },
  "maithihoangbichtram": { officialName: "Mai Thi Hoang Bich Tram", dept: "Cut&Sew WNK3", expectedCount: 10 },
  "maithiloan": { officialName: "Mai Thi Loan", dept: "Cut&Sew WNK3", expectedCount: 10 },
  "ngohuuchi": { officialName: "Ngo Huu Chi", dept: "UPH Support WNK3", expectedCount: 16 },
  "nguyendangviet": { officialName: "Nguyen Dang Viet", dept: "Components", expectedCount: 19 },
  "nguyenhaitrieu": { officialName: "Nguyen Hai Trieu", dept: "Cut&Sew WNK3", expectedCount: 11 },
  "nguyenphuocduy": { officialName: "Nguyen Phuoc Duy", dept: "Cut&Sew WNK3", expectedCount: 11 },
  "nguyenthimongvan": { officialName: "Nguyen Thi Mong Van", dept: "Training", expectedCount: 8 },
  "nguyentrongthuy": { officialName: "Nguyen Trong Thuy", dept: "Components", expectedCount: 19 },
  "phamdinhtung": { officialName: "Pham Dinh Tung", dept: "Cut&Sew WNK3", expectedCount: 6 },
  "phamhungminh": { officialName: "Pham Hung Minh", dept: "Components", expectedCount: 19 },
  "phanthanhson": { officialName: "Phan Thanh Son", dept: "Cut&Sew WNK3", expectedCount: 11 },
  "phanthiha": { officialName: "Phan Thi Ha", dept: "Training", expectedCount: 13 },
  "quachledu": { officialName: "Quach Le Du", dept: "Training", expectedCount: 15 },
  "quyenlam": { officialName: "Quyen Lam", dept: "Training", expectedCount: 8 },
  "quuyenlam": { officialName: "Quyen Lam", dept: "Training", expectedCount: 8 },
  "thuydo": { officialName: "Thuy Do", dept: "Cut&Sew WNK3", expectedCount: 6 },
  "tomnguyen": { officialName: "Tom Nguyen", dept: "Planning & Inventory Control", expectedCount: 41 },
  "tongthisang": { officialName: "Tong Thi Sang", dept: "Blow Molding", expectedCount: 12 },
  "trancongminh": { officialName: "Tran Cong Minh", dept: "Training", expectedCount: 21 },
  "tranminhthuan": { officialName: "Tran Minh Thuan", dept: "Cut&Sew WNK3", expectedCount: 13 },
  "trinhngocphien": { officialName: "Trinh Ngoc Phien", dept: "IT", expectedCount: 16 },
  "trinhthikimloan": { officialName: "Trinh Thi Kim Loan", dept: "Cut&Sew WNK3", expectedCount: 11 },
  "truongminhhung": { officialName: "Truong Minh Hung", dept: "Training", expectedCount: 8 },
  "truongthithuytrang": { officialName: "Truong Thi Thuy Trang", dept: "Cut&Sew WNK3", expectedCount: 11 },
  "truongthithuyrang": { officialName: "Truong Thi Thuy Trang", dept: "Cut&Sew WNK3", expectedCount: 11 },
  "tuannguyen": { officialName: "Tuan Nguyen", dept: "Training", expectedCount: 8 },
  "vochitinh": { officialName: "Vo Chi Tinh", dept: "Cut&Sew WNK3", expectedCount: 6 },
  "vovuluan": { officialName: "Vo Vu Luan", dept: "Training", expectedCount: 11 },
  "vuvanxuan": { officialName: "Vu Van Xuan", dept: "Procurement", expectedCount: 16 },
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

// Combine and assign final sequential IDs
export const dbIndividualIDPs: IndividualIDP[] = [...mlnRecords, ...processedWnkRecords].map((idp, idx) => ({
  ...idp,
  id: `idp-final-${idx + 1}`
}));
