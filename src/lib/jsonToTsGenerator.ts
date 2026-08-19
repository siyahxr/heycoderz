export interface JsonToTsOptions {
  rootName?: string;
  kind?: "interface" | "type";
  isReadonly?: boolean;
  isOptional?: boolean;
  semicolons?: boolean;
}

export function generateTypeScriptFromJson(jsonStr: string, options: JsonToTsOptions = {}): { code: string; error?: string } {
  const rootName = options.rootName?.trim() || "RootObject";
  const kind = options.kind || "interface";
  const isReadonly = options.isReadonly ?? false;
  const isOptional = options.isOptional ?? false;
  const semi = options.semicolons ?? true ? ";" : "";

  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (err: any) {
    return { code: "", error: err.message || "Geçersiz JSON formatı" };
  }

  const generatedInterfaces: Map<string, string> = new Map();

  function toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") || "NestedType";
  }

  function resolveType(val: any, parentKey: string): string {
    if (val === null) return "any";
    if (val === undefined) return "undefined";

    if (Array.isArray(val)) {
      if (val.length === 0) return "any[]";
      // Check elements in array
      const types = Array.from(new Set(val.map((item) => resolveType(item, `${parentKey}Item`))));
      if (types.length === 1) {
        return `${types[0]}[]`;
      }
      return `(${types.join(" | ")})[]`;
    }

    if (typeof val === "object") {
      const typeName = toPascalCase(parentKey);
      createStructure(val, typeName);
      return typeName;
    }

    return typeof val;
  }

  function createStructure(obj: Record<string, any>, typeName: string) {
    if (generatedInterfaces.has(typeName)) return;

    const entries = Object.entries(obj);
    const lines: string[] = [];

    for (const [key, val] of entries) {
      const sanitizedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      const valType = resolveType(val, key);
      const readonlyPrefix = isReadonly ? "readonly " : "";
      const optionalSuffix = isOptional ? "?" : "";
      lines.push(`  ${readonlyPrefix}${sanitizedKey}${optionalSuffix}: ${valType}${semi}`);
    }

    if (kind === "interface") {
      const def = `export interface ${typeName} {\n${lines.join("\n")}\n}`;
      generatedInterfaces.set(typeName, def);
    } else {
      const def = `export type ${typeName} = {\n${lines.join("\n")}\n}${semi}`;
      generatedInterfaces.set(typeName, def);
    }
  }

  if (Array.isArray(parsed)) {
    if (parsed.length > 0 && typeof parsed[0] === "object" && parsed[0] !== null) {
      createStructure(parsed[0], `${rootName}Item`);
      const rootType = kind === "interface"
        ? `export type ${rootName} = ${rootName}Item[]${semi}`
        : `export type ${rootName} = ${rootName}Item[]${semi}`;
      generatedInterfaces.set(rootName, rootType);
    } else {
      return {
        code: `export type ${rootName} = any[]${semi}`,
      };
    }
  } else if (typeof parsed === "object" && parsed !== null) {
    createStructure(parsed, rootName);
  } else {
    return {
      code: `export type ${rootName} = ${typeof parsed}${semi}`,
    };
  }

  // Reverse so dependencies come before the root
  const allDefs = Array.from(generatedInterfaces.values()).reverse();
  return { code: allDefs.join("\n\n") };
}
