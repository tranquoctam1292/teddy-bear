/**
 * Auto-fix Common SEO Issues
 * Automatically fixes common SEO problems
 */

import type { SEOIssue } from '@/lib/schemas/seo-analysis';

export interface AutoFixResult {
  success: boolean;
  fixed: number;
  failed: number;
  fixes: Array<{
    issue: SEOIssue;
    fixed: boolean;
    error?: string;
    newValue?: string;
  }>;
}

/**
 * Common fixable issues
 */
const FIXABLE_ISSUES: Record<string, {
  canFix: (issue: SEOIssue, currentValue?: any) => boolean;
  fix: (issue: SEOIssue, currentValue?: any) => any;
}> = {
  'title.length': {
    canFix: (issue) => {
      const match = issue.message.match(/(\d+)/);
      if (!match) return false;
      const length = parseInt(match[1]);
      return length > 60; // Too long
    },
    fix: (issue, currentValue?: string) => {
      if (!currentValue) return currentValue;
      if (currentValue.length > 60) {
        return currentValue.substring(0, 57) + '...';
      }
      return currentValue;
    },
  },
  'description.length': {
    canFix: (issue) => {
      const match = issue.message.match(/(\d+)/);
      if (!match) return false;
      const length = parseInt(match[1]);
      return length > 160; // Too long
    },
    fix: (issue, currentValue?: string) => {
      if (!currentValue) return currentValue;
      if (currentValue.length > 160) {
        return currentValue.substring(0, 157) + '...';
      }
      return currentValue;
    },
  },
};

/**
 * Auto-fix issues for an entity
 */
export function autoFixIssues(
  issues: SEOIssue[],
  currentData: Record<string, any> = {}
): AutoFixResult {
  const fixes: AutoFixResult['fixes'] = [];
  let fixed = 0;
  let failed = 0;

  for (const issue of issues) {
    if (!issue.fixable) {
      fixes.push({ issue, fixed: false });
      continue;
    }

    const fixer = FIXABLE_ISSUES[issue.field];
    if (!fixer) {
      fixes.push({ issue, fixed: false });
      continue;
    }

    if (!fixer.canFix(issue, currentData[issue.field])) {
      fixes.push({ issue, fixed: false });
      continue;
    }

    try {
      const newValue = fixer.fix(issue, currentData[issue.field]);
      fixes.push({
        issue,
        fixed: true,
        newValue,
      });
      fixed++;
    } catch (error) {
      fixes.push({
        issue,
        fixed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      failed++;
    }
  }

  return {
    success: fixed > 0,
    fixed,
    failed,
    fixes,
  };
}

/**
 * Get fixable issues count
 */
export function getFixableIssuesCount(issues: SEOIssue[]): number {
  return issues.filter(issue => {
    if (!issue.fixable) return false;
    const fixer = FIXABLE_ISSUES[issue.field];
    if (!fixer) return false;
    return true;
  }).length;
}


