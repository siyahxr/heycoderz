export interface SqlFormatterOptions {
  uppercase?: boolean;
  indent?: string;
  linesBetweenQueries?: number;
}

const MAJOR_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "HAVING",
  "ORDER BY",
  "LIMIT",
  "OFFSET",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "CREATE TABLE",
  "CREATE INDEX",
  "DROP TABLE",
  "ALTER TABLE",
  "UNION ALL",
  "UNION",
  "WITH",
];

const JOIN_KEYWORDS = [
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "FULL OUTER JOIN",
  "CROSS JOIN",
  "INNER JOIN",
  "NATURAL JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "JOIN",
  "ON",
];

const SUB_KEYWORDS = [
  "AND",
  "OR",
  "BETWEEN",
  "IN",
  "LIKE",
  "IS NULL",
  "IS NOT NULL",
  "NOT IN",
  "EXISTS",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "AS",
  "DISTINCT",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "ASC",
  "DESC",
];

export function formatSQLQuery(sql: string, options: SqlFormatterOptions = {}): string {
  const uppercase = options.uppercase ?? true;
  const indentStr = options.indent ?? "  ";

  if (!sql.trim()) return "";

  // Normalize spaces
  let text = sql.trim().replace(/\s+/g, " ");

  // Replace all keywords according to case
  const allKeywords = [...MAJOR_KEYWORDS, ...JOIN_KEYWORDS, ...SUB_KEYWORDS].sort(
    (a, b) => b.length - a.length
  );

  for (const kw of allKeywords) {
    const reg = new RegExp(`\\b${kw.replace(/\s+/g, "\\s+")}\\b`, "gi");
    const replacement = uppercase ? kw.toUpperCase() : kw.toLowerCase();
    text = text.replace(reg, replacement);
  }

  // Break lines for major clauses
  for (const kw of MAJOR_KEYWORDS) {
    const key = uppercase ? kw.toUpperCase() : kw.toLowerCase();
    const reg = new RegExp(`\\s*\\b${key.replace(/\s+/g, "\\s+")}\\b\\s*`, "g");
    text = text.replace(reg, `\n${key} `);
  }

  // Break lines for Joins
  for (const kw of JOIN_KEYWORDS) {
    const key = uppercase ? kw.toUpperCase() : kw.toLowerCase();
    const reg = new RegExp(`\\s*\\b${key.replace(/\s+/g, "\\s+")}\\b\\s*`, "g");
    if (key.toUpperCase() === "ON") {
      text = text.replace(reg, ` ON `);
    } else {
      text = text.replace(reg, `\n${indentStr}${key} `);
    }
  }

  // Line breaks for AND / OR inside WHERE
  const andKey = uppercase ? "AND" : "and";
  const orKey = uppercase ? "OR" : "or";
  text = text.replace(new RegExp(`\\s*\\b${andKey}\\b\\s*`, "g"), `\n${indentStr}${andKey} `);
  text = text.replace(new RegExp(`\\s*\\b${orKey}\\b\\s*`, "g"), `\n${indentStr}${orKey} `);

  // Clean lines and indent
  const rawLines = text.split("\n");
  const formattedLines: string[] = [];
  let depth = 0;

  for (let line of rawLines) {
    line = line.trim();
    if (!line) continue;

    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;

    if (line.startsWith(")")) {
      depth = Math.max(0, depth - 1);
    }

    const currentIndent = indentStr.repeat(depth);
    formattedLines.push(currentIndent + line);

    depth += openParens - closeParens;
    depth = Math.max(0, depth);
  }

  return formattedLines.join("\n").trim();
}

export function minifySQLQuery(sql: string): string {
  return sql
    .replace(/--.*$/gm, "") // remove single line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // remove multi-line comments
    .replace(/\s+/g, " ")
    .replace(/\s*([,()=<>+/*-])\s*/g, "$1 ")
    .trim();
}
