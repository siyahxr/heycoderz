export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  oldLineNumber?: number;
  newLineNumber?: number;
  text: string;
}

export interface DiffResult {
  lines: DiffLine[];
  additions: number;
  deletions: number;
  unchanged: number;
}

/**
 * Computes line-by-line diff using Longest Common Subsequence (LCS).
 */
export function computeLineDiff(oldText: string, newText: string): DiffResult {
  const oldLines = oldText.split(/\r?\n/);
  const newLines = newText.split(/\r?\n/);

  const m = oldLines.length;
  const n = newLines.length;

  // dp table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff
  let i = m;
  let j = n;
  const rawDiff: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      rawDiff.push({
        type: "unchanged",
        oldLineNumber: i,
        newLineNumber: j,
        text: oldLines[i - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.push({
        type: "added",
        newLineNumber: j,
        text: newLines[j - 1],
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawDiff.push({
        type: "removed",
        oldLineNumber: i,
        text: oldLines[i - 1],
      });
      i--;
    }
  }

  const lines = rawDiff.reverse();

  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const line of lines) {
    if (line.type === "added") additions++;
    else if (line.type === "removed") deletions++;
    else unchanged++;
  }

  return {
    lines,
    additions,
    deletions,
    unchanged,
  };
}
