/**
 * Types definition for Millennium TR&SP Executive Dashboard
 */

export type NineBoxCell =
  | 'Seasoned Professional'
  | 'High Professional'
  | 'Superstar'
  | 'Solid Professional'
  | 'Valued Contributor'
  | 'Rising Star'
  | 'Learning Professional'
  | 'Future Utility'
  | 'Diamond in the Rough';

export type NineBoxGroup = 'Growers' | 'Keepers' | 'Movers';

export interface Talent {
  name: string;
  cell: NineBoxCell;
  group: NineBoxGroup;
  results: 'High Effective' | 'Effective' | 'Less Effective';
  potential: 'High' | 'Mid' | 'Low';
  dept: string;
  site?: 'MLN' | 'WNK';
  newTransition?: boolean;
  highRisk?: boolean;
  idpExpiryDays?: number;
  needsNewIDP?: boolean;
}

export interface PipelinePosition {
  id: number;
  incumbent: string;
  dept: string;
  role: string;
  risk: 'High' | 'Medium' | 'Low';
  status: string; // 'Interim Coverage Only' | 'Ready Successor Identified' | 'Successor in Development' | 'No Successor Identified'
  interim: string;
  successor: string;
  readiness: 'Ready Now' | '< 1 Year' | '1-2 Years' | 'None';
  pipeline: 'At Risk' | 'Critical' | 'Covered' | 'Developing';
  site?: 'MLN' | 'WNK';
}

export interface TrainingProposal {
  priority: number;
  category: string;
  focus: string;
  needs: number;
  coverage: string;
  action: string;
  program: string;
  owner: string;
  depts: string[];
}

export interface IndividualIDP {
  id: string;
  empCode: string;
  viName: string;
  engName: string;
  site: string;
  location: string;
  department: string;
  section: string;
  position: string;
  title: string;
  jobDuty: string;
  rRating: string;
  topOpportunity: string;
  comments: string;
  wayForward: string;
  timeline: string;
  note: string;
  sourceFile: string;
  mappedNeed: string;
  competencyFocus: string;
  trainingCategory: string;
  action: string;
  proposedProgram: string;
  owner: string;
}

