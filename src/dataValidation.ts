/**
 * DATA VALIDATION SYSTEM
 * Tự động phát hiện lỗi data: dept trống, count mismatch, wrong site/dept
 * Chạy khi app khởi động và log cảnh báo ra console
 */

import { Talent, PipelinePosition } from './types';

export interface ValidationWarning {
  level: 'error' | 'warn' | 'info';
  category: string;
  message: string;
  details?: string;
}

// ── EXPECTED COUNTS (từ file gốc) ──────────────────────────
const EXPECTED_COUNTS = {
  ASH: { talents: 44, pipeline: 60, growers: 16, keepers: 26, movers: 2 },
  WNK: { talents: 56, pipeline: 56, growers: 26, keepers: 30, movers: 0 },
  MLN: { talents: 100, pipeline: 72 },
};

// ── EXPECTED DEPTS (từ file gốc) ───────────────────────────
const EXPECTED_DEPTS: Record<string, string[]> = {
  ASH: ['CUSTOMER SERVICE','CUSTOMS','FINANCE & ACCOUNTING','HUMAN RESOURCES','INFORMATION SYSTEM','LOGISTICS','WAREHOUSE'],
  WNK: ['Blow Molding','Components','Cut&Sew WNK2','Cut&Sew WNK3','DC - C&S Raw Material','Human Resources','IT','Planning & Inventory Control','TAT Quality','Training','UPH Assembly WNK2','UPH Assembly WNK3','UPH Support WNK2','UPH Support WNK3'],
  MLN: ['Customs','Cut&Sew','EHS','Engineering','Finance & Accounting','Logistics','Mattress','PIC','Plant Engineering','Quality Control','TAT','Training','Warehouse'],
};

// ── KNOWN CORRECTIONS (user-confirmed overrides vs file) ───
const KNOWN_CORRECTIONS: Record<string, string> = {
  'Chivas Cao': 'IT', // File says Cut&Sew WNK3 but confirmed IT by user
};

export function validateData(
  allTalents: Talent[],
  allPipeline: PipelinePosition[]
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  const sites: Array<'ASH' | 'WNK' | 'MLN'> = ['ASH', 'WNK', 'MLN'];

  for (const site of sites) {
    const siteTalents = allTalents.filter(t => (t.site || 'MLN') === site);
    const sitePipeline = allPipeline.filter(p => (p.site || 'MLN') === site);
    const expected = EXPECTED_COUNTS[site];
    const expectedDepts = EXPECTED_DEPTS[site] || [];

    // 1. Count validation
    if (expected.talents && siteTalents.length !== expected.talents) {
      warnings.push({
        level: 'error',
        category: `${site} 9-Box Count`,
        message: `Expected ${expected.talents} talents, found ${siteTalents.length}`,
        details: `Difference: ${siteTalents.length - expected.talents > 0 ? '+' : ''}${siteTalents.length - expected.talents}`,
      });
    }

    if (expected.pipeline && sitePipeline.length !== expected.pipeline) {
      warnings.push({
        level: 'error',
        category: `${site} Pipeline Count`,
        message: `Expected ${expected.pipeline} positions, found ${sitePipeline.length}`,
      });
    }

    // 2. Group count validation (ASH & WNK)
    if (site === 'ASH' || site === 'WNK') {
      const growers = siteTalents.filter(t => t.group === 'Growers').length;
      const keepers = siteTalents.filter(t => t.group === 'Keepers').length;
      const movers = siteTalents.filter(t => t.group === 'Movers' || t.group === ('Mover' as any)).length;
      const exp = expected as typeof EXPECTED_COUNTS.ASH;

      if (exp.growers !== undefined && growers !== exp.growers) {
        warnings.push({ level: 'warn', category: `${site} Groups`, message: `Growers: expected ${exp.growers}, found ${growers}` });
      }
      if (exp.keepers !== undefined && keepers !== exp.keepers) {
        warnings.push({ level: 'warn', category: `${site} Groups`, message: `Keepers: expected ${exp.keepers}, found ${keepers}` });
      }
      if (exp.movers !== undefined && movers !== exp.movers) {
        warnings.push({ level: 'warn', category: `${site} Groups`, message: `Movers: expected ${exp.movers}, found ${movers}` });
      }
    }

    // 3. Empty dept validation — phòng ban có trong list nhưng không có talent
    const talentDepts = new Set(siteTalents.map(t => t.dept));
    for (const dept of expectedDepts) {
      if (!talentDepts.has(dept)) {
        warnings.push({
          level: 'error',
          category: `${site} Empty Dept`,
          message: `Department "${dept}" has 0 talents — will show empty in 9-Box filter`,
          details: 'Check if dept name in data.ts matches exactly (case-sensitive)',
        });
      }
    }

    // 4. Unknown dept validation — talent có dept không trong expected list
    for (const dept of talentDepts) {
      if (!expectedDepts.includes(dept)) {
        const count = siteTalents.filter(t => t.dept === dept).length;
        warnings.push({
          level: 'warn',
          category: `${site} Unknown Dept`,
          message: `Department "${dept}" (${count} talents) not in expected dept list`,
          details: 'May cause filter issues if not added to department dropdown',
        });
      }
    }

    // 5. Missing site tag
    const noSite = siteTalents.filter(t => !t.site);
    if (noSite.length > 0) {
      warnings.push({
        level: 'warn',
        category: `${site} Missing Site`,
        message: `${noSite.length} talents missing site tag (defaulting to MLN)`,
        details: noSite.map(t => t.name).join(', '),
      });
    }

    // 6. Invalid group values
    const validGroups = ['Growers', 'Keepers', 'Movers', 'Mover'];
    const badGroup = siteTalents.filter(t => !validGroups.includes(t.group || ''));
    if (badGroup.length > 0) {
      warnings.push({
        level: 'error',
        category: `${site} Invalid Group`,
        message: `${badGroup.length} talents have invalid group value`,
        details: badGroup.map(t => `${t.name}:${t.group}`).join(', '),
      });
    }

    // 7. Known corrections check
    for (const [name, correctDept] of Object.entries(KNOWN_CORRECTIONS)) {
      const talent = siteTalents.find(t => t.name === name);
      if (talent && talent.dept !== correctDept) {
        warnings.push({
          level: 'error',
          category: `${site} Known Correction`,
          message: `${name} should be in "${correctDept}" but found in "${talent.dept}"`,
          details: 'User-confirmed correction — update data.ts',
        });
      }
    }
  }

  // 8. Duplicate names within same site
  for (const site of sites) {
    const siteTalents = allTalents.filter(t => (t.site || 'MLN') === site);
    const names = siteTalents.map(t => t.name);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    if (dupes.length > 0) {
      warnings.push({
        level: 'error',
        category: `${site} Duplicates`,
        message: `Duplicate talent names found: ${[...new Set(dupes)].join(', ')}`,
      });
    }
  }

  return warnings;
}

export function logValidationResults(warnings: ValidationWarning[]): void {
  if (warnings.length === 0) {
    console.log('%c✅ DATA VALIDATION PASSED — No issues found', 'color: #10b981; font-weight: bold; font-size: 12px;');
    return;
  }

  const errors = warnings.filter(w => w.level === 'error');
  const warns = warnings.filter(w => w.level === 'warn');

  console.group('%c🔍 DATA VALIDATION REPORT', 'color: #f59e0b; font-weight: bold; font-size: 13px;');
  console.log(`Total: ${warnings.length} issues (${errors.length} errors, ${warns.length} warnings)`);

  if (errors.length > 0) {
    console.group('%c❌ ERRORS (must fix)', 'color: #ef4444; font-weight: bold;');
    errors.forEach(w => {
      console.error(`[${w.category}] ${w.message}${w.details ? `\n  → ${w.details}` : ''}`);
    });
    console.groupEnd();
  }

  if (warns.length > 0) {
    console.group('%c⚠️ WARNINGS (should review)', 'color: #f59e0b; font-weight: bold;');
    warns.forEach(w => {
      console.warn(`[${w.category}] ${w.message}${w.details ? `\n  → ${w.details}` : ''}`);
    });
    console.groupEnd();
  }

  console.groupEnd();
}