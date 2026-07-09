import { Talent, PipelinePosition, TrainingProposal } from './types';


// ============================================================
// ASHTON (ASH) SITE DATA
// ============================================================

export const ashDepartments = [
  "ALL",
  "CUSTOMER SERVICE",
  "CUSTOMS",
  "FINANCE & ACCOUNTING",
  "HUMAN RESOURCES",
  "INFORMATION SYSTEM",
  "LOGISTICS",
  "WAREHOUSE",
];

// 9-Box Talent Pool — Ashton (44 talents)
export const ashTalentPool: Talent[] = [
  // HUMAN RESOURCES
  { name: "Lisa Nguyen", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "HUMAN RESOURCES", site: "ASH" },
  { name: "Ellie Tran", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "HUMAN RESOURCES", site: "ASH" },
  { name: "Jay Nguyen", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "HUMAN RESOURCES", site: "ASH" },
  { name: "Gemma Thach", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "HUMAN RESOURCES", site: "ASH" },
  { name: "Luca Hoang", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "HUMAN RESOURCES", site: "ASH" },
  { name: "Carlo Pham", cell: "Future Utility", results: "Less Effective", potential: "Mid", group: "Movers", dept: "HUMAN RESOURCES", site: "ASH" },
  // FINANCE & ACCOUNTING
  { name: "Ha Nguyen", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "FINANCE & ACCOUNTING", site: "ASH" },
  { name: "Windy Sy", cell: "Superstar", results: "High Effective", potential: "High", group: "Growers", dept: "FINANCE & ACCOUNTING", site: "ASH" },
  { name: "Helen Ngo", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "FINANCE & ACCOUNTING", site: "ASH" },
  { name: "Cheryl Nguyen", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "FINANCE & ACCOUNTING", site: "ASH" },
  { name: "Maya Nguyen", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "FINANCE & ACCOUNTING", site: "ASH" },
  // INFORMATION SYSTEM
  { name: "Ryder Nguyen", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "INFORMATION SYSTEM", site: "ASH" },
  { name: "River Le", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "INFORMATION SYSTEM", site: "ASH" },
  { name: "Denis Vy", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "INFORMATION SYSTEM", site: "ASH" },
  { name: "Harry Hoang", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "INFORMATION SYSTEM", site: "ASH" },
  // LOGISTICS
  { name: "LE KIM PHUONG (ALANA)", cell: "Seasoned Professional", results: "High Effective", potential: "Low", group: "Keepers", dept: "LOGISTICS", site: "ASH" },
  { name: "LE NGUYEN NGOC DAI (ALICE)", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "LOGISTICS", site: "ASH" },
  { name: "LAM HUY HOANG (STEPHEN)", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "LOGISTICS", site: "ASH" },
  { name: "NGUYEN HOANG MY LINH (KYLIE)", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "LOGISTICS", site: "ASH" },
  { name: "PHAM THI THUY TRANG (TANA)", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "LOGISTICS", site: "ASH" },
  { name: "HUYNH THI MY NGOC (CRYSTAL)", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "LOGISTICS", site: "ASH" },
  // WAREHOUSE
  { name: "Thinh Mai", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "WAREHOUSE", site: "ASH" },
  { name: "Violet Nguyen", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "WAREHOUSE", site: "ASH" },
  { name: "Ngoc Dinh", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "WAREHOUSE", site: "ASH" },
  { name: "Clara Chau", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "WAREHOUSE", site: "ASH" },
  { name: "Kaylee Truong", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "WAREHOUSE", site: "ASH" },
  // CUSTOMS
  { name: "Julie Phung", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "CUSTOMS", site: "ASH" },
  { name: "Raymond Nguyen", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "CUSTOMS", site: "ASH" },
  { name: "Susan Dang", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "CUSTOMS", site: "ASH" },
  { name: "Lona Nguyen", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "CUSTOMS", site: "ASH" },
  { name: "Daniel Bui", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "CUSTOMS", site: "ASH" },
  { name: "Anna Nguyen", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "CUSTOMS", site: "ASH" },
  { name: "Tiny Nguyen", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "CUSTOMS", site: "ASH" },
  { name: "Harry Nguyen", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "CUSTOMS", site: "ASH" },
  // CUSTOMER SERVICE
  { name: "Helen Nguyen", cell: "Seasoned Professional", results: "High Effective", potential: "Low", group: "Keepers", dept: "CUSTOMER SERVICE", site: "ASH" },
  { name: "Kami Nguyen", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "CUSTOMER SERVICE", site: "ASH" },
  { name: "Chloe Truong", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "CUSTOMER SERVICE", site: "ASH" },
  { name: "Mi Nguyen", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "CUSTOMER SERVICE", site: "ASH" },
  { name: "Cathy Nguyen", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "CUSTOMER SERVICE", site: "ASH" },
  { name: "Leo Nguyen", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "CUSTOMER SERVICE", site: "ASH" },
  { name: "Jassy Nguyen", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "CUSTOMER SERVICE", site: "ASH" },
  { name: "Mia Nguyen", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "CUSTOMER SERVICE", site: "ASH" },
  { name: "Amy Nguyen", cell: "Diamond in the Rough", results: "Less Effective", potential: "High", group: "Movers", dept: "CUSTOMER SERVICE", site: "ASH" },
];

// Pipeline Positions — Ashton (60 critical roles from CRA)
export const ashPipelinePositions: PipelinePosition[] = [
  { id: 2001, incumbent: "Lisa Nguyen", dept: "HUMAN RESOURCES", role: "HR Specialist", risk: "Medium", status: "Ready Successor Identified", interim: "Ellie Tran", successor: "Ellie Tran", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2002, incumbent: "Ellie Tran", dept: "HUMAN RESOURCES", role: "HR Specialist", risk: "Medium", status: "Ready Successor Identified", interim: "Lisa Nguyen", successor: "Lisa Nguyen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2003, incumbent: "Windy Sy", dept: "FINANCE & ACCOUNTING", role: "FA Manager", risk: "Medium", status: "Ready Successor Identified", interim: "Ha Nguyen", successor: "Ha Nguyen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2004, incumbent: "Ha Nguyen", dept: "FINANCE & ACCOUNTING", role: "Assistant FA Manager", risk: "Medium", status: "Ready Successor Identified", interim: "Maya Nguyen", successor: "Maya Nguyen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2005, incumbent: "Helen Ngo", dept: "FINANCE & ACCOUNTING", role: "GL Accountant", risk: "Medium", status: "Ready Successor Identified", interim: "Cheryl Nguyen", successor: "Cheryl & Maya", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2006, incumbent: "Cheryl Nguyen", dept: "FINANCE & ACCOUNTING", role: "GL Accountant", risk: "Medium", status: "Ready Successor Identified", interim: "Maya Nguyen", successor: "Maya & Helen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2007, incumbent: "Maya Nguyen", dept: "FINANCE & ACCOUNTING", role: "Business Analyst", risk: "Medium", status: "Ready Successor Identified", interim: "Ha Nguyen", successor: "Ha Nguyen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2008, incumbent: "DENIS VY", dept: "INFORMATION SYSTEM", role: "IT Technician", risk: "Medium", status: "Interim Coverage Only", interim: "Ryder Nguyen", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2009, incumbent: "RYDER NGUYEN", dept: "INFORMATION SYSTEM", role: "IT Technician", risk: "Medium", status: "Interim Coverage Only", interim: "Denis Vy", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2010, incumbent: "HARRY HOANG", dept: "INFORMATION SYSTEM", role: "IT Software Support & Developer", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2011, incumbent: "RIVER LE", dept: "INFORMATION SYSTEM", role: "IT Technician", risk: "Medium", status: "Ready Successor Identified", interim: "Jindo Nguyen", successor: "Jindo Nguyen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2012, incumbent: "LE KIM PHUONG (ALANA)", dept: "LOGISTICS", role: "Senior Logistics Specialist", risk: "Medium", status: "Ready Successor Identified", interim: "Daisy Phan", successor: "Daisy Phan", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2013, incumbent: "NGUYEN HOANG MY LINH (KYLIE)", dept: "LOGISTICS", role: "Logistics Specialist", risk: "High", status: "Successor in Development", interim: "None", successor: "Alice Le", readiness: "1-2 Years", pipeline: "Developing", site: "ASH" },
  { id: 2014, incumbent: "LE NGUYEN NGOC DAI (ALICE)", dept: "LOGISTICS", role: "Logistics Staff", risk: "High", status: "Successor in Development", interim: "Solina Nguyen", successor: "Solina Nguyen", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2015, incumbent: "LAM HUY HOANG (STEPHEN)", dept: "LOGISTICS", role: "Logistics Specialist", risk: "Medium", status: "Ready Successor Identified", interim: "Doris Ton", successor: "Doris Ton", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2016, incumbent: "PHAM THI THUY TRANG (TANA)", dept: "LOGISTICS", role: "Logistics Specialist", risk: "Medium", status: "Ready Successor Identified", interim: "Cindy Nguyen", successor: "Cindy Nguyen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2017, incumbent: "HUYNH THI MY NGOC (CRYSTAL)", dept: "LOGISTICS", role: "Logistics Specialist", risk: "Medium", status: "Successor in Development", interim: "Daniel Nguyen", successor: "Daniel Nguyen", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2018, incumbent: "Ngoc Dinh", dept: "WAREHOUSE", role: "Inventory Team Leader", risk: "High", status: "Ready Successor Identified", interim: "Thinh Mai", successor: "Thinh Mai", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2019, incumbent: "Thinh Mai", dept: "WAREHOUSE", role: "RPC Leader", risk: "Medium", status: "Ready Successor Identified", interim: "Ngoc Dinh", successor: "Ngoc Dinh", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2020, incumbent: "Kaylee Truong", dept: "WAREHOUSE", role: "Data Clerk", risk: "Medium", status: "Ready Successor Identified", interim: "Thinh Mai", successor: "Thinh Mai", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2021, incumbent: "Violet Nguyen", dept: "WAREHOUSE", role: "PPH Calculation Specialist", risk: "High", status: "Successor in Development", interim: "None", successor: "Kaylee Truong", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2022, incumbent: "Clara Chau", dept: "WAREHOUSE", role: "ALS Coordinator", risk: "High", status: "Successor in Development", interim: "None", successor: "Thinh Mai", readiness: "1-2 Years", pipeline: "Developing", site: "ASH" },
  { id: 2023, incumbent: "Julie Phung", dept: "CUSTOMS", role: "Customs Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2024, incumbent: "Tiny Nguyen", dept: "CUSTOMS", role: "Customs Specialist", risk: "Low", status: "Ready Successor Identified", interim: "Lona Nguyen", successor: "Lona Nguyen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2025, incumbent: "Lona Nguyen", dept: "CUSTOMS", role: "Customs Specialist", risk: "Low", status: "Ready Successor Identified", interim: "Harry Phan", successor: "Harry Phan", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2026, incumbent: "Harry Phan", dept: "CUSTOMS", role: "Customs Specialist", risk: "Low", status: "Ready Successor Identified", interim: "Tiny Nguyen", successor: "Tiny Nguyen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2027, incumbent: "Phan Tuấn Kiệt", dept: "WAREHOUSE", role: "CG Supervisor", risk: "Medium", status: "Successor in Development", interim: "None", successor: "Diệp Tuấn Thanh", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2028, incumbent: "Diệp Tuấn Thanh", dept: "WAREHOUSE", role: "CG Team Leader", risk: "Medium", status: "Successor in Development", interim: "None", successor: "Lý Văn Anh", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2029, incumbent: "Lý Văn Anh", dept: "WAREHOUSE", role: "CG Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2030, incumbent: "Vũ Quốc Huy", dept: "WAREHOUSE", role: "UPH Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2031, incumbent: "Châu Văn Đoàn", dept: "WAREHOUSE", role: "UPH Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2032, incumbent: "Nguyễn Hoàng Kha", dept: "WAREHOUSE", role: "UPH Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2033, incumbent: "Ngô Đức Kiên", dept: "WAREHOUSE", role: "Picking Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2034, incumbent: "Trần Minh Quang", dept: "WAREHOUSE", role: "Picking Supervisor", risk: "Medium", status: "Successor in Development", interim: "None", successor: "Ngô Đức Kiên", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2035, incumbent: "Châu Minh Sang", dept: "WAREHOUSE", role: "Picking Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2036, incumbent: "Tống Anh Nghĩa", dept: "WAREHOUSE", role: "Picking Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2037, incumbent: "Nguyễn Tấn Linh", dept: "WAREHOUSE", role: "Loading Supervisor", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2038, incumbent: "Phạm Văn Tới", dept: "WAREHOUSE", role: "Loading Supervisor", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2039, incumbent: "Hà Văn Quân", dept: "WAREHOUSE", role: "Loading Supervisor", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2040, incumbent: "Phạm Quang Trường", dept: "WAREHOUSE", role: "Loading Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2041, incumbent: "Nguyễn Văn Chung", dept: "WAREHOUSE", role: "Loading Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2042, incumbent: "Danh Thành Vững", dept: "WAREHOUSE", role: "Loading Team Leader", risk: "Medium", status: "Successor in Development", interim: "None", successor: "VU LUU HUU LOC", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2043, incumbent: "Nguyễn Phúc Hậu", dept: "WAREHOUSE", role: "Loading Team Leader", risk: "Medium", status: "Successor in Development", interim: "None", successor: "Le Thanh Tung", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2044, incumbent: "Vũ Đình Khánh", dept: "WAREHOUSE", role: "Loading Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2045, incumbent: "Trần Văn Phụng", dept: "WAREHOUSE", role: "Loading Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2046, incumbent: "Huỳnh Thanh Qui", dept: "WAREHOUSE", role: "Loading Clerk", risk: "Medium", status: "Successor in Development", interim: "None", successor: "Trần Thị Thúy Vy", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2047, incumbent: "Nguyễn Hải Vân", dept: "WAREHOUSE", role: "Picking Clerk", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2048, incumbent: "Đặng Nhật Đức Anh", dept: "WAREHOUSE", role: "Picking Clerk", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2049, incumbent: "Mai Lâm Anh", dept: "WAREHOUSE", role: "CG Receiving Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2050, incumbent: "Trần Anh Nhật", dept: "WAREHOUSE", role: "CG Receiving Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2051, incumbent: "Nguyễn Thị Thúy Vy", dept: "WAREHOUSE", role: "Admin Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2052, incumbent: "Võ Anh Cảnh", dept: "WAREHOUSE", role: "Warehouse Manager", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "Critical", site: "ASH" },
  { id: 2053, incumbent: "Francisco Gonzalez", dept: "WAREHOUSE", role: "Warehouse Director", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "Critical", site: "ASH" },
  { id: 2054, incumbent: "Philip Vuong", dept: "WAREHOUSE", role: "Warehouse Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2055, incumbent: "Kim Trần", dept: "WAREHOUSE", role: "Warehouse Manager", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "Critical", site: "ASH" },
  { id: 2056, incumbent: "Mi Nguyen", dept: "CUSTOMER SERVICE", role: "Customer Service Specialist", risk: "Medium", status: "Successor in Development", interim: "Mia Nguyen", successor: "Mia Nguyen", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2057, incumbent: "Chloe Truong", dept: "CUSTOMER SERVICE", role: "Customer Service Specialist", risk: "Medium", status: "Successor in Development", interim: "Jessie Ngo", successor: "Jessie Ngo", readiness: "< 1 Year", pipeline: "Developing", site: "ASH" },
  { id: 2058, incumbent: "Helen Nguyen", dept: "CUSTOMER SERVICE", role: "Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
  { id: 2059, incumbent: "Leo Nguyen", dept: "CUSTOMER SERVICE", role: "Customer Service Specialist", risk: "Medium", status: "Ready Successor Identified", interim: "Jassy Nguyen", successor: "Jassy Nguyen", readiness: "Ready Now", pipeline: "Covered", site: "ASH" },
  { id: 2060, incumbent: "Kelly Phan", dept: "CUSTOMER SERVICE", role: "Customer Service Specialist", risk: "Medium", status: "Interim Coverage Only", interim: "Kami Nguyen", successor: "None", readiness: "None", pipeline: "At Risk", site: "ASH" },
];

// Training Plan — Ashton (from ASH_DevPlan_Master.xlsx)
export const dbProposalTrainingASH: TrainingProposal[] = [
  {
    priority: 1,
    category: "Leadership",
    focus: "Leadership Skills",
    needs: 4,
    coverage: "29%",
    action: "Add to Training Plan",
    program: "Servant Leadership Program",
    owner: "L&D + HRBP",
    depts: ["FINANCE & ACCOUNTING", "HUMAN RESOURCES"],
  },
  {
    priority: 2,
    category: "Soft Skill",
    focus: "Communication Skills",
    needs: 12,
    coverage: "100%",
    action: "Add to Training Plan",
    program: "Communication & Presentation Workshop",
    owner: "L&D + HRBP",
    depts: ["CUSTOMER SERVICE", "CUSTOMS", "FINANCE & ACCOUNTING", "HUMAN RESOURCES", "INFORMATION SYSTEM", "LOGISTICS", "WAREHOUSE"],
  },
  {
    priority: 3,
    category: "People Development",
    focus: "Coaching Skills",
    needs: 57,
    coverage: "100%",
    action: "Add to Training Plan",
    program: "Train the Trainer / Coaching Program",
    owner: "L&D + HRBP",
    depts: ["CUSTOMER SERVICE", "CUSTOMS", "FINANCE & ACCOUNTING", "HUMAN RESOURCES", "INFORMATION SYSTEM", "LOGISTICS", "WAREHOUSE"],
  },
  {
    priority: 4,
    category: "Digital",
    focus: "AI & Automation",
    needs: 4,
    coverage: "14%",
    action: "Add to Training Plan",
    program: "AI for Everyone; Power Automate; Power BI",
    owner: "L&D + HRBP",
    depts: ["INFORMATION SYSTEM"],
  },
  {
    priority: 6,
    category: "Business Acumen",
    focus: "Business Acumen",
    needs: 13,
    coverage: "71%",
    action: "Need Validation",
    program: "Business Acumen Framework",
    owner: "L&D + HRBP / Dept",
    depts: ["CUSTOMER SERVICE", "CUSTOMS", "HUMAN RESOURCES", "LOGISTICS", "WAREHOUSE"],
  },
  {
    priority: 7,
    category: "Functional",
    focus: "Process & Compliance",
    needs: 54,
    coverage: "86%",
    action: "Department Follow-up",
    program: "Process Improvement / Compliance Follow-up",
    owner: "Department / Functional SME",
    depts: ["CUSTOMER SERVICE", "CUSTOMS", "FINANCE & ACCOUNTING", "INFORMATION SYSTEM", "LOGISTICS", "WAREHOUSE"],
  },
  {
    priority: 8,
    category: "Functional",
    focus: "Workforce Planning",
    needs: 27,
    coverage: "71%",
    action: "Department Follow-up",
    program: "Workforce / Ramp Planning Follow-up",
    owner: "Department / Functional SME",
    depts: ["CUSTOMER SERVICE", "CUSTOMS", "HUMAN RESOURCES", "LOGISTICS", "WAREHOUSE"],
  },
  {
    priority: 9,
    category: "Functional",
    focus: "Finance / Cost Management",
    needs: 22,
    coverage: "86%",
    action: "Department Follow-up",
    program: "Finance / Cost Management Follow-up",
    owner: "Department / Functional SME",
    depts: ["CUSTOMER SERVICE", "CUSTOMS", "FINANCE & ACCOUNTING", "HUMAN RESOURCES", "LOGISTICS", "WAREHOUSE"],
  },
  {
    priority: 10,
    category: "Functional",
    focus: "Employee Relations",
    needs: 6,
    coverage: "71%",
    action: "Department Follow-up",
    program: "Employee Relations Follow-up",
    owner: "Department / Functional SME",
    depts: ["CUSTOMER SERVICE", "CUSTOMS", "HUMAN RESOURCES", "LOGISTICS", "WAREHOUSE"],
  },
];


export const dbTalentPool: Talent[] = [
  {
    "name": "NGUYEN, TINA",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "Finance & Accounting"
  },
  {
    "name": "NGUYEN, SERENA",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Finance & Accounting"
  },
  {
    "name": "HUYNH, LINDSAY",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Finance & Accounting"
  },
  {
    "name": "NGUYEN, AKINA",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Finance & Accounting"
  },
  {
    "name": "Robert Pham",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Plant Engineering"
  },
  {
    "name": "Hubert",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "TAT"
  },
  {
    "name": "Lydia",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "TAT"
  },
  {
    "name": "Jacob",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "TAT"
  },
  {
    "name": "Edena",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "TAT"
  },
  {
    "name": "Maris",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "TAT"
  },
  {
    "name": "Adeline",
    "cell": "Future Utility",
    "group": "Mover",
    "results": "Less Effective",
    "potential": "Mid",
    "dept": "TAT"
  },
  {
    "name": "LILY PHAM",
    "cell": "Seasoned Professional",
    "group": "Keepers",
    "results": "High Effective",
    "potential": "Low",
    "dept": "EHS"
  },
  {
    "name": "COLIN NGUYEN",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "EHS"
  },
  {
    "name": "KAI NGUYEN",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "EHS"
  },
  {
    "name": "LAUREN LE",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "EHS"
  },
  {
    "name": "ANGELA TRAN",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "EHS"
  },
  {
    "name": "JERRY NGUYEN",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "EHS"
  },
  {
    "name": "ZANE NGUYEN",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "EHS"
  },
  {
    "name": "KARIN VO",
    "cell": "Diamond in the Rough",
    "group": "Mover",
    "results": "Less Effective",
    "potential": "High",
    "dept": "EHS"
  },
  {
    "name": "LUKE NGUYEN",
    "cell": "Diamond in the Rough",
    "group": "Mover",
    "results": "Less Effective",
    "potential": "High",
    "dept": "EHS"
  },
  {
    "name": "David Ho",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Engineering"
  },
  {
    "name": "ĐINH VĂN HƯNG",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Engineering"
  },
  {
    "name": "NGUYỄN VĂN PHONG",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Engineering"
  },
  {
    "name": "NGUYỄN NHẬT DUY",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Engineering"
  },
  {
    "name": "HUGO DAO",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "Logistics"
  },
  {
    "name": "LISA TRAN",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Logistics"
  },
  {
    "name": "ELLA VY",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Logistics"
  },
  {
    "name": "CLARA BUI",
    "cell": "Superstar",
    "group": "Growers",
    "results": "High Effective",
    "potential": "High",
    "dept": "Logistics"
  },
  {
    "name": "GAVIN TRAN",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Logistics"
  },
  {
    "name": "TYSON THAI",
    "cell": "Diamond in the Rough",
    "group": "Mover",
    "results": "Less Effective",
    "potential": "High",
    "dept": "Logistics"
  },
  {
    "name": "Lee Nguyen",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "Mattress"
  },
  {
    "name": "Vera Bui",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "Mattress"
  },
  {
    "name": "Kevin Tran",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Mattress"
  },
  {
    "name": "Lory Ho",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Mattress"
  },
  {
    "name": "Nguyễn Văn Tài",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Trần Đăng Khoa",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Bùi Ngọc Thuận",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Trịnh Quang Hão",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Đắc Nghĩa",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Đinh Văn Đức",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Văn Thái",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Trương Quốc Vinh",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Phạm Được",
    "cell": "Superstar",
    "group": "Growers",
    "results": "High Effective",
    "potential": "High",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Duy Vinh",
    "cell": "Superstar",
    "group": "Growers",
    "results": "High Effective",
    "potential": "High",
    "dept": "Warehouse"
  },
  {
    "name": "Phạm Hạnh",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Warehouse"
  },
  {
    "name": "Võ Văn Việt",
    "cell": "Seasoned Professional",
    "group": "Keepers",
    "results": "High Effective",
    "potential": "Low",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Thanh Tân",
    "cell": "Seasoned Professional",
    "group": "Keepers",
    "results": "High Effective",
    "potential": "Low",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Mạnh",
    "cell": "Seasoned Professional",
    "group": "Keepers",
    "results": "High Effective",
    "potential": "Low",
    "dept": "Warehouse"
  },
  {
    "name": "Trần Văn Thương",
    "cell": "Seasoned Professional",
    "group": "Keepers",
    "results": "High Effective",
    "potential": "Low",
    "dept": "Warehouse"
  },
  {
    "name": "Trương Đình Tiên",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "Warehouse"
  },
  {
    "name": "Ngô Như Đạt",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "Warehouse"
  },
  {
    "name": "Lê Thị Hảo",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Dương Văn Đạt",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Văn Linh",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Thị Phượng Vy",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Lê Quốc Hiển",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Phan Đình Hưng",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Trương Văn Toàn",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Lê Văn Chính",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Warehouse"
  },
  {
    "name": "Lê Hùng Hải",
    "cell": "Superstar",
    "group": "Growers",
    "results": "High Effective",
    "potential": "High",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Tấn Tín",
    "cell": "Superstar",
    "group": "Growers",
    "results": "High Effective",
    "potential": "High",
    "dept": "Warehouse"
  },
  {
    "name": "Từ Trung Hiếu",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Warehouse"
  },
  {
    "name": "Võ Ngọc Hùng",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Văn Toản",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Warehouse"
  },
  {
    "name": "Nguyễn Tấn Đạt",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Warehouse"
  },
  {
    "name": "TUYẾT",
    "cell": "Seasoned Professional",
    "group": "Keepers",
    "results": "High Effective",
    "potential": "Low",
    "dept": "Cut&Sew"
  },
  {
    "name": "CHUNG",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "Cut&Sew"
  },
  {
    "name": "THÚY",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "HÙNG",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "OANH",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "LỆ",
    "cell": "Superstar",
    "group": "Growers",
    "results": "High Effective",
    "potential": "High",
    "dept": "Cut&Sew"
  },
  {
    "name": "NHUNG",
    "cell": "Superstar",
    "group": "Growers",
    "results": "High Effective",
    "potential": "High",
    "dept": "Cut&Sew"
  },
  {
    "name": "LIỄU",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Cut&Sew"
  },
  {
    "name": "NGUYỆN",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Cut&Sew"
  },
  {
    "name": "Sương",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "Quân",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "Thảo",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "Hội",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "Hòa",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "KHIÊM",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "Will",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Cut&Sew"
  },
  {
    "name": "Hạnh",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Cut&Sew"
  },
  {
    "name": "Trang",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Cut&Sew"
  },
  {
    "name": "Sara Dang",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Customs"
  },
  {
    "name": "Helen Vo",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "Customs"
  },
  {
    "name": "Rose Vo",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Customs"
  },
  {
    "name": "Farah Le",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Customs"
  },
  {
    "name": "Steven",
    "cell": "Seasoned Professional",
    "group": "Keepers",
    "results": "High Effective",
    "potential": "Low",
    "dept": "PIC"
  },
  {
    "name": "Jenny",
    "cell": "Seasoned Professional",
    "group": "Keepers",
    "results": "High Effective",
    "potential": "Low",
    "dept": "PIC"
  },
  {
    "name": "Felix",
    "cell": "Solid Professional",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Low",
    "dept": "PIC"
  },
  {
    "name": "Rita",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "PIC"
  },
  {
    "name": "Jane",
    "cell": "Valued Contributor",
    "group": "Keepers",
    "results": "Effective",
    "potential": "Mid",
    "dept": "PIC"
  },
  {
    "name": "Alice",
    "cell": "Diamond in the Rough",
    "group": "Movers",
    "results": "Less Effective",
    "potential": "High",
    "dept": "PIC"
  },
  {
    "name": "Ho Truc",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Training"
  },
  {
    "name": "Tristan Nguyen",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Quality Control"
  },
  {
    "name": "Asha Truong",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Quality Control"
  },
  {
    "name": "Eric Nguyen",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Quality Control"
  },
  {
    "name": "Evan Le",
    "cell": "High Professional",
    "group": "Growers",
    "results": "High Effective",
    "potential": "Mid",
    "dept": "Plant Engineering"
  },
  {
    "name": "Anh Le",
    "cell": "Superstar",
    "group": "Growers",
    "results": "High Effective",
    "potential": "High",
    "dept": "Plant Engineering"
  },
  {
    "name": "Jake Doan",
    "cell": "Rising Star",
    "group": "Growers",
    "results": "Effective",
    "potential": "High",
    "dept": "Plant Engineering"
  },
  { name: "Ashton Vo", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Training", site: "WNK" },
  { name: "Quach Le Du", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Training", site: "WNK" },
  { name: "Vo Vu Luan", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Training", site: "WNK" },
  { name: "Phan Thi Ha", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Training", site: "WNK" },
  { name: "Tran Cong Minh", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Training", site: "WNK" },
  { name: "Nguyen Thi Mong Van", cell: "Seasoned Professional", results: "High Effective", potential: "Low", group: "Keepers", dept: "DC - C&S Raw Material", site: "WNK" },
  { name: "Truong Minh Hung", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Components", site: "WNK" },
  { name: "Harvey Nguyen", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Edgar Bui", cell: "Superstar", results: "High Effective", potential: "High", group: "Growers", dept: "TAT Quality", site: "WNK" },
  { name: "Pham Hung Minh", cell: "Seasoned Professional", results: "High Effective", potential: "Low", group: "Keepers", dept: "Components", site: "WNK" },
  { name: "Nguyen Dang Viet", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "Components", site: "WNK" },
  { name: "Nguyen Trong Thuy", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "Components", site: "WNK" },
  { name: "Chivas Cao", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "IT", site: "WNK" },
  { name: "Danny Cao", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "IT", site: "WNK" },
  { name: "Leo Le", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "IT", site: "WNK" },
  { name: "Lucian Nguyen", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "IT", site: "WNK" },
  { name: "Willy Pham", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "IT", site: "WNK" },
  { name: "Tuan Nguyen", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Human Resources", site: "WNK" },
  { name: "Ginta Doan", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "Human Resources", site: "WNK" },
  { name: "Quyen Lam", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Human Resources", site: "WNK" },
  { name: "Hana Truong", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Human Resources", site: "WNK" },
  { name: "Anna Tran", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Le Thi Huong", cell: "Seasoned Professional", results: "High Effective", potential: "Low", group: "Keepers", dept: "Cut&Sew WNK2", site: "WNK" },
  { name: "Nguyen Hai Trieu", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "UPH Assembly WNK2", site: "WNK" },
  { name: "Truong Thi Thuy Trang", cell: "Seasoned Professional", results: "High Effective", potential: "Low", group: "Keepers", dept: "UPH Support WNK2", site: "WNK" },
  { name: "Le Thi Tuyen", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Cut&Sew WNK2", site: "WNK" },
  { name: "Trinh Thi Kim Loan", cell: "Seasoned Professional", results: "High Effective", potential: "Low", group: "Keepers", dept: "Cut&Sew WNK2", site: "WNK" },
  { name: "Nguyen Phuoc Duy", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "UPH Support WNK2", site: "WNK" },
  { name: "Phan Thanh Son", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Cut&Sew WNK2", site: "WNK" },
  { name: "Le Tuan Anh", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "UPH Assembly WNK2", site: "WNK" },
  { name: "Daniel Pham", cell: "Superstar", results: "High Effective", potential: "High", group: "Growers", dept: "IT", site: "WNK" },
  { name: "Huynh Van Nhat", cell: "Seasoned Professional", results: "High Effective", potential: "Low", group: "Keepers", dept: "Components", site: "WNK" },
  { name: "Tran Minh Thuan", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "UPH Assembly WNK2", site: "WNK" },
  { name: "Duong Tri Dung", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Blow Molding", site: "WNK" },
  { name: "Ly Thanh Tung", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "Components", site: "WNK" },
  { name: "Tong Thi Sang", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "DC - C&S Raw Material", site: "WNK" },
  { name: "Mai Hai Long", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "UPH Support WNK3", site: "WNK" },
  { name: "Dang Van Tan", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "UPH Support WNK3", site: "WNK" },
  { name: "Ngo Huu Chi", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "UPH Support WNK3", site: "WNK" },
  { name: "Pham Dinh Tung", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Thuy Do", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Bui Van Thap", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Vo Chi Tinh", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Kelvin Huynh", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Planning & Inventory Control", site: "WNK" },
  { name: "Tom Nguyen", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Planning & Inventory Control", site: "WNK" },
  { name: "Dominic Duong", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Planning & Inventory Control", site: "WNK" },
  { name: "Mai Thi Loan", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Do Thi Thanh Nga", cell: "Solid Professional", results: "Effective", potential: "Low", group: "Keepers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Elsa Nguyen", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Mai Thi Hoang Bich Tram", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Annie Nguyen", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Human Resources", site: "WNK" },
  { name: "Amber Dinh", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "Human Resources", site: "WNK" },
  { name: "Vu Van Xuan", cell: "High Professional", results: "High Effective", potential: "Mid", group: "Growers", dept: "UPH Assembly WNK3", site: "WNK" },
  { name: "Giap Quang Huy", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "UPH Support WNK3", site: "WNK" },
  { name: "Dinh Thi Hong Van", cell: "Valued Contributor", results: "Effective", potential: "Mid", group: "Keepers", dept: "Cut&Sew WNK3", site: "WNK" },
  { name: "Trinh Ngoc Phien", cell: "Rising Star", results: "Effective", potential: "High", group: "Growers", dept: "Cut&Sew WNK3", site: "WNK" },
  // ── ASHTON (ASH) ──────────────────────────────────────────
  ...ashTalentPool,
];

export const dbTrainingSummary: Record<string, number[]> = {
  "ALL": [79, 44, 30, 29, 25],
  "Cut&Sew": [34, 12, 10, 8, 9],
  "Warehouse": [20, 8, 6, 4, 2],
  "Finance & Accounting": [12, 10, 8, 4, 3],
  "EHS": [10, 5, 2, 2, 2],
  "Logistics": [4, 5, 2, 3, 2],
  "PIC": [10, 8, 5, 2, 5],
  "Engineering": [5, 4, 2, 1, 1],
  "Plant Engineering": [6, 3, 2, 2, 2],
  "TAT": [8, 5, 4, 3, 1],
  "Customs": [3, 2, 1, 1, 1],
  "Quality Control": [2, 1, 1, 1, 0],
  "Training": [1, 2, 0, 0, 0]
};

export const initialPipelinePositions: Omit<PipelinePosition, 'pipeline'>[] = [
  { id: 1, incumbent: "NGUYEN, VINCENT", dept: "Finance & Accounting", role: "Material Cost Asst Manager", risk: "Medium", status: "Interim Coverage Only", interim: "LINDSAY/AKINA", successor: "None", readiness: "None" },
  { id: 2, incumbent: "NGUYEN, TINA", dept: "Finance & Accounting", role: "Material Cost Accountant", risk: "Low", status: "Interim Coverage Only", interim: "AKINA", successor: "None", readiness: "None" },
  { id: 3, incumbent: "NGUYEN, SERENA", dept: "Finance & Accounting", role: "Material Cost Accountant", risk: "Low", status: "Interim Coverage Only", interim: "LINDSAY", successor: "None", readiness: "None" },
  { id: 4, incumbent: "NGUYEN, AKINA", dept: "Finance & Accounting", role: "Material Cost Accountant", risk: "Low", status: "Interim Coverage Only", interim: "SERENA", successor: "None", readiness: "None" },
  { id: 5, incumbent: "HUYNH, LINDSAY", dept: "Finance & Accounting", role: "Material Cost Accountant", risk: "Low", status: "Interim Coverage Only", interim: "AKINA", successor: "None", readiness: "None" },
  { id: 6, incumbent: "Robert Pham", dept: "Plant Engineering", role: "Automation/IE Facilitator", risk: "High", status: "Interim Coverage Only", interim: "Jake Doan", successor: "None", readiness: "None" },
  { id: 7, incumbent: "Jacob", dept: "TAT", role: "TAT Lead Supervisor", risk: "Medium", status: "Ready Successor Identified", interim: "Vanessa", successor: "Vanessa", readiness: "1-2 Years" },
  { id: 8, incumbent: "Hubert", dept: "TAT", role: "TAT Lead Supervisor", risk: "Medium", status: "Ready Successor Identified", interim: "Phu", successor: "Phu", readiness: "1-2 Years" },
  { id: 9, incumbent: "Edena", dept: "TAT", role: "TAT Lead Supervisor", risk: "Medium", status: "Ready Successor Identified", interim: "Xavi", successor: "Thanh", readiness: "1-2 Years" },
  { id: 10, incumbent: "Maris", dept: "TAT", role: "Department Secretary", risk: "Medium", status: "Ready Successor Identified", interim: "Hasia", successor: "Ngan", readiness: "1-2 Years" },
  { id: 11, incumbent: "Lydia", dept: "TAT", role: "Quality Engineer", risk: "Medium", status: "Successor in Development", interim: "None", successor: "Dilys", readiness: "1-2 Years" },
  { id: 12, incumbent: "Adeline", dept: "TAT", role: "Quality Engineer", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 13, incumbent: "LILY PHAM", dept: "EHS", role: "EHS Supervisor", risk: "Medium", status: "Interim Coverage Only", interim: "ERICA LE", successor: "None", readiness: "None" },
  { id: 14, incumbent: "JERRY NGUYEN", dept: "EHS", role: "Senior EHS Engineer", risk: "Medium", status: "Ready Successor Identified", interim: "ERICA LE", successor: "ZANE NGUYEN", readiness: "1-2 Years" },
  { id: 15, incumbent: "ZANE NGUYEN", dept: "EHS", role: "EHS Specialist", risk: "Medium", status: "Ready Successor Identified", interim: "None", successor: "JERRY NGUYEN", readiness: "Ready Now" },
  { id: 16, incumbent: "KAI NGUYEN (NS)", dept: "EHS", role: "EHS Specialist (NS)", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 17, incumbent: "ANGELA TRAN", dept: "EHS", role: "EHS Trainer", risk: "High", status: "Ready Successor Identified", interim: "LILY PHAM", successor: "LAUREN LE", readiness: "1-2 Years" },
  { id: 18, incumbent: "David Ho", dept: "Engineering", role: "IE Technician", risk: "High", status: "Ready Successor Identified", interim: "Kenneth Nguyen - Supervisor", successor: "NGUYỄN NHẬT DUY", readiness: "1-2 Years" },
  { id: 19, incumbent: "ĐINH VĂN HƯNG", dept: "Engineering", role: "Sample technician", risk: "Medium", status: "Ready Successor Identified", interim: "David Ho", successor: "David Ho", readiness: "Ready Now" },
  { id: 20, incumbent: "NGUYỄN VĂN PHONG", dept: "Engineering", role: "Sample technician", risk: "High", status: "Ready Successor Identified", interim: "David Ho", successor: "David Ho", readiness: "Ready Now" },
  { id: 21, incumbent: "NGUYỄN NHẬT DUY", dept: "Engineering", role: "Sample technician", risk: "Medium", status: "Ready Successor Identified", interim: "David Ho", successor: "David Ho", readiness: "Ready Now" },
  { id: 22, incumbent: "CLARA BUI", dept: "Logistics", role: "Logistics Supervisor", risk: "High", status: "Ready Successor Identified", interim: "Celine Huynh / Gavin Tran", successor: "Gavin Tran", readiness: "1-2 Years" },
  { id: 23, incumbent: "LISA TRAN", dept: "Logistics", role: "Senior Logistics Specialist", risk: "Medium", status: "Ready Successor Identified", interim: "Clara Bui / Gavin Tran", successor: "Clara Bui / Ella Vy", readiness: "1-2 Years" },
  { id: 24, incumbent: "ELLA VY", dept: "Logistics", role: "Logistics Specialist", risk: "High", status: "Ready Successor Identified", interim: "Celine Huynh / Clara Bui", successor: "Clara Bui / Lisa Tran", readiness: "1-2 Years" },
  { id: 25, incumbent: "GAVIN TRAN", dept: "Logistics", role: "Logistics Specialist", risk: "Medium", status: "Ready Successor Identified", interim: "Clara Bui / Mily Tran", successor: "Clara Bui / Mily Tran", readiness: "1-2 Years" },
  { id: 26, incumbent: "MILY NGUYEN", dept: "Logistics", role: "Logistics Staff", risk: "Medium", status: "Ready Successor Identified", interim: "Clara Bui / Ella Vy", successor: "Clara Bui / Ella Vy", readiness: "1-2 Years" },
  { id: 27, incumbent: "HUGO DAO", dept: "Logistics", role: "Logistics Staff", risk: "High", status: "Ready Successor Identified", interim: "Clara Bui / Tyson Thai", successor: "Clara Bui / Tyson Thai", readiness: "1-2 Years" },
  { id: 28, incumbent: "TYSON THAI", dept: "Logistics", role: "Logistics Staff", risk: "High", status: "Ready Successor Identified", interim: "Clara Bui / Hugo Dao", successor: "Clara Bui / Tyson Thai", readiness: "1-2 Years" },
  { id: 29, incumbent: "Lee Nguyen", dept: "Mattress", role: "Lead Supervisor", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 30, incumbent: "Kevin Tran", dept: "Mattress", role: "Lead Supervisor", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 31, incumbent: "Vera Bui", dept: "Mattress", role: "Lead Supervisor", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 32, incumbent: "Lory Ho", dept: "Mattress", role: "Department Secretary", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 33, incumbent: "Open", dept: "Mattress", role: "Assistant Manager", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 34, incumbent: "Pham Hanh", dept: "Warehouse", role: "WH Lead Supervisor", risk: "Medium", status: "Ready Successor Identified", interim: "Michael Dinh", successor: "Pham Duoc, Nguyen Duy Vinh", readiness: "1-2 Years" },
  { id: 35, incumbent: "Pham Duoc", dept: "Warehouse", role: "WH Supervisor", risk: "High", status: "Ready Successor Identified", interim: "Vinh Truong", successor: "Le Hung Hai", readiness: "1-2 Years" },
  { id: 36, incumbent: "Nguyen Duy Vinh", dept: "Warehouse", role: "WH Supervisor", risk: "Medium", status: "Interim Coverage Only", interim: "Khoa Tran", successor: "None", readiness: "None" },
  { id: 37, incumbent: "Tran Kieu", dept: "Warehouse", role: "HJ Specialist", risk: "High", status: "Ready Successor Identified", interim: "None", successor: "Elly Tran", readiness: "1-2 Years" },
  { id: 38, incumbent: "HARRON", dept: "Cut&Sew", role: "Production Manager - C&S", risk: "Medium", status: "Ready Successor Identified", interim: "Nguyen Thi My Le", successor: "Trần Thị Thu Thúy", readiness: "Ready Now" },
  { id: 39, incumbent: "SILAS", dept: "Cut&Sew", role: "Production Manager", risk: "Medium", status: "Interim Coverage Only", interim: "Trương Thị Nhung", successor: "None", readiness: "None" },
  { id: 40, incumbent: "VI", dept: "Cut&Sew", role: "Production Asst Manager", risk: "Medium", status: "Interim Coverage Only", interim: "Phạm thị Liễu", successor: "None", readiness: "None" },
  { id: 41, incumbent: "Sara Dang", dept: "Customs", role: "Supervisor", risk: "High", status: "Ready Successor Identified", interim: "Levi Tran", successor: "Farah Le", readiness: "1-2 Years" },
  { id: 42, incumbent: "Helen Vo", dept: "Customs", role: "Team Leader", risk: "Medium", status: "Ready Successor Identified", interim: "Levi Tran", successor: "Alina", readiness: "1-2 Years" },
  { id: 43, incumbent: "Farah Le", dept: "Customs", role: "Team Leader", risk: "High", status: "Ready Successor Identified", interim: "Levi Tran", successor: "Molly Bui", readiness: "1-2 Years" },
  { id: 44, incumbent: "Rose Vo", dept: "Customs", role: "Specialist", risk: "High", status: "Ready Successor Identified", interim: "Levi Tran", successor: "Alina", readiness: "1-2 Years" },
  { id: 45, incumbent: "RITA", dept: "PIC", role: "Suppervisor", risk: "High", status: "Ready Successor Identified", interim: "None", successor: "Jenny", readiness: "1-2 Years" },
  { id: 46, incumbent: "JANE", dept: "PIC", role: "Suppervisor", risk: "Medium", status: "Ready Successor Identified", interim: "None", successor: "Felix", readiness: "1-2 Years" },
  { id: 47, incumbent: "ALICE", dept: "PIC", role: "Suppervisor", risk: "High", status: "Ready Successor Identified", interim: "None", successor: "Steven", readiness: "1-2 Years" },
  { id: 48, incumbent: "JENNY", dept: "PIC", role: "Senior staff", risk: "Medium", status: "Ready Successor Identified", interim: "Nancy", successor: "Nancy", readiness: "1-2 Years" },
  { id: 49, incumbent: "FELIX", dept: "PIC", role: "Senior staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 50, incumbent: "STEVEN", dept: "PIC", role: "Senior staff", risk: "Medium", status: "Ready Successor Identified", interim: "Lita", successor: "Zandy", readiness: "1-2 Years" },
  { id: 51, incumbent: "NANCY", dept: "PIC", role: "Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 52, incumbent: "CALEY", dept: "PIC", role: "Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 53, incumbent: "DYNELL", dept: "PIC", role: "Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 54, incumbent: "OLIVER", dept: "PIC", role: "Clerk", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 55, incumbent: "ZANDY", dept: "PIC", role: "Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 56, incumbent: "LITA", dept: "PIC", role: "Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 57, incumbent: "DERRICK", dept: "PIC", role: "Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 58, incumbent: "Mania", dept: "PIC", role: "Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  { id: 59, incumbent: "HO TRUC", dept: "Training", role: "Training Lead Supervisor", risk: "High", status: "Ready Successor Identified", interim: "Chau Dinh", successor: "Nguyen Trang", readiness: "1-2 Years" },
  { id: 60, incumbent: "JOANNA NGUYEN", dept: "Quality Control", role: "QC Assistant Manager", risk: "High", status: "Ready Successor Identified", interim: "Tristan Nguyen", successor: "Eric Nguyen, Asha Truong", readiness: "1-2 Years" },
  { id: 61, incumbent: "Anh Le", dept: "Plant Engineering", role: "Manager", risk: "Medium", status: "Ready Successor Identified", interim: "Paul Nguyen", successor: "Paul Nguyen", readiness: "Ready Now" },
  { id: 62, incumbent: "Evan Le", dept: "Plant Engineering", role: "Manager", risk: "Medium", status: "Successor in Development", interim: "Marco Nguyen", successor: "Marco Nguyen, Tra Pham", readiness: "1-2 Years" },
  { id: 63, incumbent: "Jake Doan", dept: "Plant Engineering", role: "Assistant Manager", risk: "Medium", status: "Ready Successor Identified", interim: "Paul Nguyen", successor: "Paul Nguyen", readiness: "Ready Now" },
  { id: 64, incumbent: "Liễu", dept: "Cut&Sew", role: "Staff", risk: "Medium", status: "Interim Coverage Only", interim: "Hội_Huỳnh", successor: "None", readiness: "None" },
  { id: 65, incumbent: "Tuyết", dept: "Cut&Sew", role: "Staff", risk: "Medium", status: "Interim Coverage Only", interim: "Thảo_Lê", successor: "None", readiness: "None" },
  { id: 66, incumbent: "Oanh", dept: "Cut&Sew", role: "Staff", risk: "Medium", status: "Interim Coverage Only", interim: "Quân", successor: "None", readiness: "None" },
  { id: 67, incumbent: "Hùng", dept: "Cut&Sew", role: "Staff", risk: "Medium", status: "Interim Coverage Only", interim: "Hòa", successor: "None", readiness: "None" },
  { id: 68, incumbent: "Nhung", dept: "Cut&Sew", role: "Staff", risk: "Medium", status: "Interim Coverage Only", interim: "Khiêm", successor: "None", readiness: "None" },
  { id: 69, incumbent: "Nguyện", dept: "Cut&Sew", role: "Staff", risk: "Medium", status: "Interim Coverage Only", interim: "Trang", successor: "None", readiness: "None" },
  { id: 70, incumbent: "Chung", dept: "Cut&Sew", role: "Staff", risk: "Medium", status: "Interim Coverage Only", interim: "Hạnh", successor: "None", readiness: "None" },
  { id: 71, incumbent: "Lệ", dept: "Cut&Sew", role: "Staff", risk: "Medium", status: "Interim Coverage Only", interim: "Sương", successor: "None", readiness: "None" },
  { id: 72, incumbent: "Thúy", dept: "Cut&Sew", role: "Staff", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None" },
  
  // ==================== WANEK (WNK) PIPELINE DATA ====================
  { id: 73, incumbent: "Ashton Vo", dept: "Training", role: "TTraining Supervisor - Project", risk: "High", status: "Interim Coverage Only", interim: "Chau Dinh", successor: "None", readiness: "None", site: "WNK" },
  { id: 74, incumbent: "Quach Le Du", dept: "Training", role: "Training Lead Supervisor", risk: "Medium", status: "Successor in Development", interim: "Chau Dinh", successor: "Phan Thi Ha", readiness: "< 1 Year", site: "WNK" },
  { id: 75, incumbent: "Phan Thi Ha", dept: "Training", role: "Training Supervisor C&S", risk: "Medium", status: "Ready Successor Identified", interim: "Quach Le Du", successor: "Hieu Nguyen", readiness: "Ready Now", site: "WNK" },
  { id: 76, incumbent: "Tran Cong Minh", dept: "Training", role: "Training Supervisor UPH", risk: "Medium", status: "Successor in Development", interim: "Ashton Vo", successor: "Phuc Huynh", readiness: "1-2 Years", site: "WNK" },
  { id: 77, incumbent: "Vo Vu Luan", dept: "Training", role: "Training Supervisor UPH", risk: "Medium", status: "Successor in Development", interim: "Chau Dinh", successor: "Ha Minh Anh", readiness: "1-2 Years", site: "WNK" },
  { id: 78, incumbent: "Nguyen Thi Mong Van", dept: "DC - C&S Raw Material", role: "Material Delivery Lead Supervisor", risk: "Medium", status: "Successor in Development", interim: "Sang Tong", successor: "Thao Phan / Robert Pham", readiness: "1-2 Years", site: "WNK" },
  { id: 79, incumbent: "Truong Minh Hung", dept: "Components", role: "Material Delivery Lead Supervisor", risk: "Medium", status: "Successor in Development", interim: "Sang Tong", successor: "Hien Nguyen", readiness: "1-2 Years", site: "WNK" },
  { id: 80, incumbent: "Harvey Nguyen", dept: "Cut&Sew WNK3", role: "TAT Manager", risk: "Medium", status: "Successor in Development", interim: "None", successor: "Trina", readiness: "1-2 Years", site: "WNK" },
  { id: 81, incumbent: "Edgar Bui", dept: "TAT Quality", role: "TAT Manager", risk: "Medium", status: "Successor in Development", interim: "None", successor: "Yes hire", readiness: "1-2 Years", site: "WNK" },
  { id: 82, incumbent: "Nguyen Dang Viet", dept: "Components", role: "Production Assistant Manager - Comp.", risk: "Medium", status: "Successor in Development", interim: "Pham Hung Minh / VIET", successor: "GIÀU / KHA / PHU / CUONG", readiness: "1-2 Years", site: "WNK" },
  { id: 83, incumbent: "Pham Hung Minh", dept: "Components", role: "Production Assistant Manager - Comp.", risk: "Medium", status: "Successor in Development", interim: "VIET / THUY", successor: "GIÀU / KHA / PHU / CUONG", readiness: "1-2 Years", site: "WNK" },
  { id: 84, incumbent: "Nguyen Trong Thuy", dept: "Components", role: "Leadsupervisor", risk: "High", status: "Interim Coverage Only", interim: "Pham Hung Minh / VIET", successor: "None", readiness: "None", site: "WNK" },
  { id: 85, incumbent: "Chivas Cao", dept: "Cut&Sew WNK3", role: "Manager", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 86, incumbent: "Lucian Nguyen", dept: "IT", role: "Manager", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 87, incumbent: "Leo Le", dept: "IT", role: "Assistant Manager", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 88, incumbent: "Danny Cao", dept: "IT", role: "Manager", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 89, incumbent: "Willy Pham", dept: "IT", role: "Assistant Manager", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 90, incumbent: "Tuan Nguyen", dept: "Human Resources", role: "Specialist", risk: "Medium", status: "Successor in Development", interim: "Quyen Lam", successor: "Ms. Jen", readiness: "1-2 Years", site: "WNK" },
  { id: 91, incumbent: "Quyen Lam", dept: "Human Resources", role: "Specialist", risk: "High", status: "Interim Coverage Only", interim: "Tuan Nguyen", successor: "None", readiness: "None", site: "WNK" },
  { id: 92, incumbent: "Hana Truong", dept: "Human Resources", role: "Team leader", risk: "Medium", status: "Successor in Development", interim: "Ginta Doan", successor: "Ginta Doan", readiness: "1-2 Years", site: "WNK" },
  { id: 93, incumbent: "Ginta Doan", dept: "Human Resources", role: "Specialist", risk: "Medium", status: "Interim Coverage Only", interim: "Hana Truong", successor: "None", readiness: "None", site: "WNK" },
  { id: 94, incumbent: "Anna Tran", dept: "Cut&Sew WNK3", role: "MRO Assistant Manager", risk: "Medium", status: "Interim Coverage Only", interim: "Louis Le / Thanh Nguyen", successor: "None", readiness: "None", site: "WNK" },
  { id: 95, incumbent: "Nguyen Phuoc Duy", dept: "UPH Support WNK2", role: "Production Lead Supervisor - UPH Support", risk: "High", status: "Successor in Development", interim: "T Anh", successor: "Ms Thành", readiness: "< 1 Year", site: "WNK" },
  { id: 96, incumbent: "Truong Thi Thuy Trang", dept: "UPH Support WNK2", role: "Production Lead Supervisor - UPH Support", risk: "High", status: "Successor in Development", interim: "H - Triều", successor: "Ms Thành", readiness: "< 1 Year", site: "WNK" },
  { id: 97, incumbent: "Nguyen Hai Trieu", dept: "UPH Assembly WNK2", role: "QC Lead Supervisor - UPH QC", risk: "High", status: "Successor in Development", interim: "P - Duy", successor: "Mr Khanh", readiness: "< 1 Year", site: "WNK" },
  { id: 98, incumbent: "Le Tuan Anh", dept: "UPH Assembly WNK2", role: "Production Lead Supervisor - UPH Assembly", risk: "Medium", status: "Ready Successor Identified", interim: "Mr An", successor: "Mr Nguyên", readiness: "Ready Now", site: "WNK" },
  { id: 99, incumbent: "Le Thi Tuyen", dept: "Cut&Sew WNK2", role: "Production Lead Supervisor", risk: "High", status: "Successor in Development", interim: "Ms Thủy", successor: "Ms Thủy", readiness: "< 1 Year", site: "WNK" },
  { id: 100, incumbent: "Le Thi Huong", dept: "Cut&Sew WNK2", role: "QP Lead Supervisor - C&S", risk: "High", status: "Ready Successor Identified", interim: "K Loan", successor: "Ms Đào", readiness: "Ready Now", site: "WNK" },
  { id: 101, incumbent: "Trinh Thi Kim Loan", dept: "Cut&Sew WNK2", role: "Production Lead Supervisor", risk: "Medium", status: "Successor in Development", interim: "P Sơn", successor: "Ms Ngọc", readiness: "< 1 Year", site: "WNK" },
  { id: 102, incumbent: "Phan Thanh Son", dept: "Cut&Sew WNK2", role: "Production Lead Supervisor - Cutting", risk: "Medium", status: "Successor in Development", interim: "Tuyên", successor: "Mr Nam", readiness: "< 1 Year", site: "WNK" },
  { id: 103, incumbent: "Daniel Pham", dept: "IT", role: "AI System Architect", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 104, incumbent: "Tran Minh Thuan", dept: "UPH Assembly WNK2", role: "Production Manager", risk: "Medium", status: "Successor in Development", interim: "None", successor: "TRIỀU / DUY", readiness: "1-2 Years", site: "WNK" },
  { id: 105, incumbent: "Huynh Van Nhat", dept: "Components", role: "Production Manager - Comp.", risk: "Medium", status: "Ready Successor Identified", interim: "None", successor: "Pham Hung Minh", readiness: "Ready Now", site: "WNK" },
  { id: 106, incumbent: "Ly Thanh Tung", dept: "Components", role: "QC Assistant Manager", risk: "High", status: "Successor in Development", interim: "None", successor: "TIẾN", readiness: "1-2 Years", site: "WNK" },
  { id: 107, incumbent: "Tong Thi Sang", dept: "DC - C&S Raw Material", role: "Material Delivery Assistant Manager", risk: "Medium", status: "Ready Successor Identified", interim: "None", successor: "VÂN", readiness: "Ready Now", site: "WNK" },
  { id: 108, incumbent: "Duong Tri Dung", dept: "Blow Molding", role: "Production Assistant Manager - Comp.", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 109, incumbent: "Dang Van Tan", dept: "UPH Support WNK3", role: "Assistant Manager", risk: "High", status: "Successor in Development", interim: "GIAP QUANG HUY(Primary)", successor: "Brad Vo", readiness: "< 1 Year", site: "WNK" },
  { id: 110, incumbent: "Mai Hai Long", dept: "UPH Support WNK3", role: "Assistant Manager", risk: "High", status: "Successor in Development", interim: "GIAP QUANG HUY(Primary)", successor: "Nguyen Minh Tung", readiness: "< 1 Year", site: "WNK" },
  { id: 111, incumbent: "Ngo Huu Chi", dept: "UPH Support WNK3", role: "Assistant Manager", risk: "High", status: "Successor in Development", interim: "GIAP QUANG HUY(Primary)", successor: "Mark Vo", readiness: "< 1 Year", site: "WNK" },
  { id: 112, incumbent: "Thuy Do", dept: "Cut&Sew WNK3", role: "Leadsupervisor", risk: "Medium", status: "Successor in Development", interim: "Bui Van Thap / Trinh Ngoc Phien (Primary)", successor: "Phan Chi Hieu", readiness: "< 1 Year", site: "WNK" },
  { id: 113, incumbent: "Bui Van Thap", dept: "Cut&Sew WNK3", role: "Leadsupervisor", risk: "High", status: "Successor in Development", interim: "Trinh Ngoc Phien (Primary)", successor: "Luong Cong Thanh", readiness: "< 1 Year", site: "WNK" },
  { id: 114, incumbent: "Pham Dinh Tung", dept: "Cut&Sew WNK3", role: "Supervisor", risk: "Medium", status: "Successor in Development", interim: "Trinh Ngoc Phien (Primary)", successor: "Ho Vu Binh", readiness: "< 1 Year", site: "WNK" },
  { id: 115, incumbent: "Vo Chi Tinh", dept: "Cut&Sew WNK3", role: "Supervisor", risk: "Medium", status: "Successor in Development", interim: "Trinh Ngoc Phien (Primary)", successor: "Le Ba Thanh", readiness: "< 1 Year", site: "WNK" },
  { id: 116, incumbent: "Kelvin Huynh", dept: "Planning & Inventory Control", role: "Senior Manager", risk: "Medium", status: "Successor in Development", interim: "Tom Nguyen", successor: "Tom Nguyen", readiness: "1-2 Years", site: "WNK" },
  { id: 117, incumbent: "Tom Nguyen", dept: "Planning & Inventory Control", role: "Manager", risk: "High", status: "Successor in Development", interim: "None", successor: "Peter / Helen", readiness: "1-2 Years", site: "WNK" },
  { id: 118, incumbent: "Dominic Duong", dept: "Planning & Inventory Control", role: "Manager", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 119, incumbent: "Elsa Nguyen", dept: "Cut&Sew WNK3", role: "QP Lead Supervisor - C&S", risk: "High", status: "Successor in Development", interim: "Dinh Van / Mai Thi Hoang Bich Tram", successor: "Do Thi Thanh Nga", readiness: "< 1 Year", site: "WNK" },
  { id: 120, incumbent: "Mai Thi Hoang Bich Tram", dept: "Cut&Sew WNK3", role: "Production Lead Supervisor - C&S", risk: "High", status: "Ready Successor Identified", interim: "Dinh Van / Do Thi Thanh Nga", successor: "Do Thi Thanh Nga", readiness: "Ready Now", site: "WNK" },
  { id: 121, incumbent: "Mai Thi Loan", dept: "Cut&Sew WNK3", role: "Production Lead Supervisor - C&S", risk: "High", status: "Ready Successor Identified", interim: "Dinh Van / Mai Thi Hoang Bich Tram / Do Thi Thanh Nga", successor: "Mai Thi Hoang Bich Tram / Do Thi Thanh Nga", readiness: "Ready Now", site: "WNK" },
  { id: 122, incumbent: "Do Thi Thanh Nga", dept: "Cut&Sew WNK3", role: "Production Lead Supervisor - C&S", risk: "High", status: "Ready Successor Identified", interim: "Dinh Van / Mai Thi Hoang Bich Tram / Mai loan", successor: "Mai Thi Hoang Bich Tram", readiness: "Ready Now", site: "WNK" },
  { id: 123, incumbent: "Annie Nguyen", dept: "Human Resources", role: "Communication Supervisor", risk: "High", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 124, incumbent: "Amber Dinh", dept: "Human Resources", role: "HRBP Team Leader", risk: "Medium", status: "No Successor Identified", interim: "None", successor: "None", readiness: "None", site: "WNK" },
  { id: 125, incumbent: "Vu Van Xuan", dept: "UPH Assembly WNK3", role: "Production Manager", risk: "Medium", status: "Successor in Development", interim: "David / quach", successor: "David / quach", readiness: "< 1 Year", site: "WNK" },
  { id: 126, incumbent: "Giap Quang Huy", dept: "UPH Support WNK3", role: "Production Manager", risk: "Medium", status: "Successor in Development", interim: "None", successor: "Mai Hai Long", readiness: "< 1 Year", site: "WNK" },
  { id: 127, incumbent: "Trinh Ngoc Phien", dept: "Cut&Sew WNK3", role: "Production Assistant Manager", risk: "Medium", status: "Successor in Development", interim: "Bui Van Thap", successor: "Pham Dinh Tung", readiness: "< 1 Year", site: "WNK" },
  { id: 128, incumbent: "Dinh Thi Hong Van", dept: "Cut&Sew WNK3", role: "Production Assistant Manager", risk: "Medium", status: "Successor in Development", interim: "Mai Thi Hoang Bich Tram", successor: "Mai Thi Hoang Bich Tram", readiness: "< 1 Year", site: "WNK" },
  // ── ASHTON (ASH) ──────────────────────────────────────────
  ...ashPipelinePositions,
];

export const dbProposalTraining: TrainingProposal[] = [
  { priority: 1, category: "Digital", focus: "AI & Automation", needs: 44, coverage: "88%", action: "Add to Training Plan", program: "AI for Everyone; Power Automate in Office", owner: "L&D + IT/Automation SME", depts: ["Quality Control", "Planning & Inventory", "EHS", "Finance & Legal", "Logistic & Service", "Information System", "Training", "Customs", "PIC", "Plant Engineering", "Finance & Accounting", "Logistics"] },
  { priority: 2, category: "Leadership", focus: "Leadership Skills", needs: 79, coverage: "75%", action: "Add to Training Plan", program: "Servant Leadership", owner: "L&D + HRBP", depts: ["Quality Control", "Planning & Inventory", "EHS", "Finance & Legal", "Information System", "Training", "Cut&Sew", "Warehouse", "Mattress", "Customs", "PIC", "Plant Engineering"] },
  { priority: 3, category: "Soft Skill", focus: "Communication Skills", needs: 30, coverage: "50%", action: "Add to Training Plan", program: "Communication & Presentation", owner: "L&D + HRBP", depts: ["Quality Control", "EHS", "Information System", "Plant Engineering", "Finance & Accounting", "Logistics", "Cut&Sew", "Customs", "PIC"] },
  { priority: 4, category: "People Development", focus: "Coaching Skills", needs: 29, coverage: "63%", action: "Add to Training Plan", program: "Coaching & Mentoring", owner: "L&D + HRBP", depts: ["Planning & Inventory", "EHS", "Finance & Legal", "Information System", "Plant Engineering", "Mattress", "Cut&Sew", "Customs", "PIC"] },
  { priority: 5, category: "People Development", focus: "People Development", needs: 25, coverage: "63%", action: "Add to Training Plan", program: "People Development / IDP & Skill Matrix", owner: "L&D + HRBP", depts: ["Quality Control", "Planning & Inventory", "EHS", "Plant Engineering", "Warehouse", "Training", "Cut&Sew", "Mattress", "PIC"] },
  { priority: 6, category: "People Development", focus: "Succession Planning", needs: 9, coverage: "50%", action: "Need Validation", program: "Succession Planning & Talent Pipeline Review", owner: "HRBP + Department", depts: ["Quality Control", "Planning & Inventory", "EHS", "Plant Engineering", "PIC", "Mattress"] },
  { priority: 7, category: "Business Acumen", focus: "Business Acumen", needs: 26, coverage: "50%", action: "Need Validation", program: "Business Acumen & Decision Making", owner: "L&D + HRBP", depts: ["Planning & Inventory", "EHS", "Logistic & Service", "Plant Engineering", "Logistics", "Mattress", "Cut&Sew", "Customs", "PIC"] },
  { priority: 8, category: "Process / Compliance", focus: "Process & Compliance", needs: 142, coverage: "75%", action: "Department Follow-up", program: "Process Improvement / Compliance Follow-up", owner: "Department / Functional SME", depts: ["Quality Control", "Planning & Inventory", "EHS", "Finance & Legal", "Information System", "Plant Engineering", "Warehouse", "Cut&Sew", "Customs", "PIC"] },
  { priority: 9, category: "Functional", focus: "Workforce Planning", needs: 96, coverage: "88%", action: "Department Follow-up", program: "Workforce / Ramp Planning Follow-up", owner: "Department / Functional SME", depts: ["Quality Control", "Planning & Inventory", "EHS", "Finance & Legal", "Logistic & Service", "Training", "Plant Engineering", "Warehouse", "Cut&Sew", "Mattress", "Customs", "PIC"] },
  { priority: 10, category: "Functional", focus: "Functional Skills", needs: 44, coverage: "88%", action: "Department Follow-up", program: "Function-specific Development Plan", owner: "Department / Functional SME", depts: ["Quality Control", "Planning & Inventory", "EHS", "Finance & Legal", "Logistic & Service", "Information System", "Training", "Warehouse", "Cut&Sew", "Engineering", "PIC"] },
  { priority: 11, category: "Functional", focus: "Employee Relations", needs: 21, coverage: "38%", action: "Department Follow-up", program: "Employee Relations Follow-up", owner: "HRBP / Department", depts: ["Planning & Inventory", "EHS", "Information System", "Warehouse", "Cut&Sew", "Mattress"] },
  { priority: 12, category: "Functional", focus: "Finance / Cost Management", needs: 17, coverage: "75%", action: "Department Follow-up", program: "Finance / Cost Management Follow-up", owner: "Department / Functional SME", depts: ["Quality Control", "Planning & Inventory", "EHS", "Finance & Legal", "Logistic & Service", "Information System", "Warehouse", "Cut&Sew", "Mattress", "Logistics", "Engineering", "PIC"] },
  { priority: 13, category: "Functional", focus: "Talent Acquisition", needs: 13, coverage: "13%", action: "Department Follow-up", program: "Talent Acquisition Follow-up", owner: "HRBP / TA", depts: ["Quality Control", "Warehouse", "Mattress"] },
  { priority: 14, category: "Functional", focus: "Training Capability", needs: 6, coverage: "38%", action: "Department Follow-up", program: "Training Capability Follow-up", owner: "Department / Functional SME", depts: ["Planning & Inventory", "EHS", "Training", "Warehouse", "PIC"] }
];

export const dbProposalTrainingWNK: TrainingProposal[] = [
  {
    priority: 1,
    category: "Leadership",
    focus: "Leadership Skills",
    needs: 47,
    coverage: "41%",
    action: "Add to Training Plan",
    program: "Servant Leadership Program",
    owner: "L&D + HRBP",
    depts: ["Blow Molding", "Components", "Cut&Sew WNK3", "DC - C&S Raw Material", "Human Resources", "IT", "Planning & Inventory Control", "TAT Quality", "Training", "UPH Assembly WNK2", "UPH Assembly WNK3", "UPH Support WNK3"]
  },
  {
    priority: 2,
    category: "Soft Skill",
    focus: "Communication Skills",
    needs: 33,
    coverage: "49%",
    action: "Add to Training Plan",
    program: "Communication & Presentation Workshop",
    owner: "L&D + HRBP",
    depts: ["Components", "Cut&Sew WNK3", "Human Resources", "IT", "Planning & Inventory Control", "TAT Quality", "Training", "UPH Assembly WNK3", "UPH Support WNK3"]
  },
  {
    priority: 3,
    category: "People Development",
    focus: "Coaching Skills",
    needs: 122,
    coverage: "51%",
    action: "Add to Training Plan",
    program: "Train the Trainer / Coaching Program",
    owner: "L&D + HRBP",
    depts: ["Cut&Sew WNK3", "Human Resources", "IT", "Planning & Inventory Control", "TAT Quality", "Training", "UPH Assembly WNK3", "UPH Support WNK3"]
  },
  {
    priority: 4,
    category: "Digital",
    focus: "AI & Automation",
    needs: 34,
    coverage: "20%",
    action: "Add to Training Plan",
    program: "AI for Everyone; Power Automate; Power BI",
    owner: "L&D + HRBP",
    depts: ["Human Resources", "IT", "Planning & Inventory Control", "TAT Quality", "Training"]
  },
  {
    priority: 6,
    category: "Business Acumen",
    focus: "Business Acumen",
    needs: 27,
    coverage: "38%",
    action: "Need Validation",
    program: "Business Acumen Framework",
    owner: "Department / Functional SME",
    depts: ["Blow Molding", "Components", "Cut&Sew WNK3", "DC - C&S Raw Material", "Human Resources", "IT", "Planning & Inventory Control", "TAT Quality", "UPH Assembly WNK2", "UPH Assembly WNK3", "UPH Support WNK3"]
  },
  {
    priority: 7,
    category: "Functional",
    focus: "Process & Compliance",
    needs: 338,
    coverage: "98%",
    action: "Department Follow-up",
    program: "Process Improvement / Compliance Follow-up",
    owner: "L&D + HRBP",
    depts: ["Blow Molding", "Components", "Cut&Sew WNK2", "Cut&Sew WNK3", "DC - C&S Raw Material", "Human Resources", "IT", "Planning & Inventory Control", "TAT Quality", "Training", "UPH Assembly WNK2", "UPH Assembly WNK3", "UPH Support WNK2", "UPH Support WNK3"]
  },
  {
    priority: 8,
    category: "Functional",
    focus: "Workforce Planning",
    needs: 95,
    coverage: "84%",
    action: "Department Follow-up",
    program: "Workforce / Ramp Planning Follow-up",
    owner: "Department / Functional SME",
    depts: ["Blow Molding", "Components", "Cut&Sew WNK2", "Cut&Sew WNK3", "DC - C&S Raw Material", "Human Resources", "IT", "Planning & Inventory Control", "TAT Quality", "Training", "UPH Assembly WNK2", "UPH Assembly WNK3", "UPH Support WNK2", "UPH Support WNK3"]
  },
  {
    priority: 9,
    category: "Functional",
    focus: "Finance / Cost Management",
    needs: 60,
    coverage: "64%",
    action: "Department Follow-up",
    program: "Finance / Cost Management Follow-up",
    owner: "L&D + HRBP",
    depts: ["Blow Molding", "Components", "Cut&Sew WNK2", "Cut&Sew WNK3", "DC - C&S Raw Material", "Human Resources", "IT", "TAT Quality", "Training", "UPH Assembly WNK2", "UPH Assembly WNK3", "UPH Support WNK2", "UPH Support WNK3"]
  },
  {
    priority: 10,
    category: "Functional",
    focus: "Employee Relations",
    needs: 31,
    coverage: "33%",
    action: "Department Follow-up",
    program: "Employee Relations Follow-up",
    owner: "L&D + HRBP / Dept",
    depts: ["Components", "Cut&Sew WNK3", "DC - C&S Raw Material", "Human Resources", "IT", "Planning & Inventory Control", "UPH Assembly WNK3", "UPH Support WNK3"]
  },
  {
    priority: 11,
    category: "Functional",
    focus: "Training Capability",
    needs: 16,
    coverage: "22%",
    action: "Department Follow-up",
    program: "Training Capability Follow-up",
    owner: "L&D + HRBP / Dept",
    depts: ["Components", "Cut&Sew WNK2", "Training", "UPH Assembly WNK2", "UPH Support WNK2"]
  },
];

export const allDepartments = [
  "ALL",
  "Cut&Sew",
  "Warehouse",
  "Finance & Accounting",
  "EHS",
  "Logistics",
  "Mattress",
  "Engineering",
  "Plant Engineering",
  "TAT",
  "Customs",
  "PIC",
  "Quality Control",
  "Training",
  "Planning & Inventory",
  "Finance & Legal",
  "Logistic & Service",
  "Information System"
];

export const wnkDepartments = [
  "ALL",
  "Blow Molding",
  "Components",
  "Cut&Sew WNK2",
  "Cut&Sew WNK3",
  "DC - C&S Raw Material",
  "Human Resources",
  "IT",
  "Planning & Inventory Control",
  "TAT Quality",
  "Training",
  "UPH Assembly WNK2",
  "UPH Assembly WNK3",
  "UPH Support WNK2",
  "UPH Support WNK3",
];

// Dynamically align dbTalentPool and initialPipelinePositions with corrected department names
const overrideWankDepts = () => {
  const norm = (s: string) => s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();

  const wnkDeptsMap: Record<string, string> = {
    "ashtonvo": "Training",
    "quachledu": "Training",
    "phanthiha": "Training",
    "trancongminh": "Training",
    "vovuluan": "Training",
    "nguyenthimongvan": "Training",
    "truongminhhung": "Training",
    "harveynguyen": "TAT Quality",
    "edgarbui": "TAT Quality",
    "buitronghung": "TAT Quality",
    "nguyendangviet": "Components",
    "phamhungminh": "Components",
    "nguyentrongthuy": "Components",
    "dannycao": "IT",
    "leole": "Cut&Sew WNK3",
    "willypham": "IT",
    "phamminhphuong": "IT",
    "chivascao": "Cut&Sew WNK3",
    "luciannguyen": "Cut&Sew WNK3",
    "tuannguyen": "Training",
    "quyenlam": "Training",
    "quuyenlam": "Training",
    "hanatruong": "Human Resources",
    "gintadoan": "Human Resources",
    "annatran": "Cut&Sew WNK3",
    "nguyenphuocduy": "Cut&Sew WNK3",
    "truongthithuytrang": "Cut&Sew WNK3",
    "truongthithuyrang": "Cut&Sew WNK3",
    "nguyenhaitrieu": "Cut&Sew WNK3",
    "letuananh": "Cut&Sew WNK3",
    "lethituyen": "Cut&Sew WNK3",
    "lethihuong": "Cut&Sew WNK3",
    "trinhthikimloan": "Cut&Sew WNK3",
    "phanthanhson": "Cut&Sew WNK3",
    "danielpham": "IT",
    "phamdangkhoa": "IT",
    "tranminhthuan": "Cut&Sew WNK3",
    "huynhvannhat": "Components",
    "duongtridung": "Blow Molding",
    "lythanhtung": "Blow Molding",
    "tongthisang": "Blow Molding",
    "dangvantan": "UPH Support WNK3",
    "maihailong": "UPH Support WNK3",
    "ngohuuchi": "UPH Support WNK3",
    "thuydo": "Cut&Sew WNK3",
    "buivanthap": "Cut&Sew WNK3",
    "phamdinhtung": "Cut&Sew WNK3",
    "vochitinh": "Cut&Sew WNK3",
    "kelvinhuynh": "Planning & Inventory Control",
    "tomnguyen": "Planning & Inventory Control",
    "dominicduong": "Planning & Inventory Control",
    "maithihoangbichtram": "Cut&Sew WNK3",
    "dothithanhnga": "Cut&Sew WNK3",
    "elsanguyen": "Cut&Sew WNK3",
    "maithiloan": "Cut&Sew WNK3",
    "annienguyen": "Human Resources",
    "amberdinh": "Human Resources",
    "dinhthihoangyen": "Human Resources",
    "vuvanxuan": "UPH Assembly WNK3",
    "giapquanghuy": "UPH Support WNK3",
    "trinhngocphien": "IT",
    "dinhthihongvan": "Cut&Sew WNK3"
  };

  dbTalentPool.forEach(t => {
    if (t.site === 'WNK') {
      const n = norm(t.name);
      if (wnkDeptsMap[n] !== undefined) {
        t.dept = wnkDeptsMap[n];
      }
    }
  });

  initialPipelinePositions.forEach(p => {
    if (p.site === 'WNK') {
      const n = norm(p.incumbent);
      if (wnkDeptsMap[n] !== undefined) {
        p.dept = wnkDeptsMap[n];
      }
    }
  });
};
overrideWankDepts();

// Helper to fully load and fill 72 pipeline positions to match All-Site distribution
export const getFullPipeline = (): PipelinePosition[] => {
  const result: PipelinePosition[] = [];
  
  // First load explicit initial positions
  initialPipelinePositions.forEach(p => {
    let pipelineStatus: 'At Risk' | 'Critical' | 'Covered' | 'Developing' = 'Covered';
    
    if (p.status === "Interim Coverage Only") {
      pipelineStatus = 'At Risk';
    } else if (p.status.includes("No Successor")) {
      pipelineStatus = 'At Risk';
    } else if (p.status.includes("Development") || p.status.includes("Developing")) {
      pipelineStatus = 'Developing';
    }
    
    // Explicit overrides
    if (p.incumbent.includes("(NS)") || p.incumbent === "Open") {
      pipelineStatus = 'Critical';
    } else if (p.risk === "High" && (pipelineStatus === 'At Risk' || p.successor === 'None')) {
      pipelineStatus = 'Critical';
    }
    
    result.push({
      ...p,
      pipeline: pipelineStatus,
      site: p.site || 'MLN'
    });
  });

  // Then auto-populate placeholders up to exactly 72 positions for each site
  const mlnCount = result.filter(r => r.site === 'MLN').length;
  const wnkCount = result.filter(r => r.site === 'WNK').length;
  
  const baseDepts = [
    "Finance & Accounting",
    "Mattress",
    "Cut&Sew",
    "Customs",
    "PIC",
    "EHS",
    "Logistics",
    "Quality Control",
    "Training",
    "Engineering",
    "Plant Engineering",
    "TAT"
  ];
  
  return result;
};
