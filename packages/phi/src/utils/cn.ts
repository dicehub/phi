export type ClassDictionary = Record<string, boolean | null | undefined>;
export type ClassArray = ClassValue[];
export type ClassValue = ClassArray | ClassDictionary | false | null | number | string | undefined;

const spacingGroups = new Set([
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "gap",
  "gap-x",
  "gap-y",
]);

const splitModifiers = (value: string) => {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "[") depth += 1;
    if (char === "]") depth = Math.max(0, depth - 1);
    if (char === ":" && depth === 0) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }

  parts.push(value.slice(start));
  return parts;
};

const conflictGroup = (token: string) => {
  const parts = splitModifiers(token);
  let base = parts.at(-1) ?? token;
  const modifiers = parts.slice(0, -1).join(":");
  let important = "";

  if (base.startsWith("!")) {
    important = "!";
    base = base.slice(1);
  }

  const prefix = modifiers ? `${modifiers}:` : "";
  const spacingMatch = base.match(/^(-?)(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y)-/);
  if (spacingMatch && spacingGroups.has(spacingMatch[2])) {
    return `${prefix}${important}${spacingMatch[2]}`;
  }

  const simpleMatch = base.match(/^(bg|text|border|rounded)-/);
  if (simpleMatch) return `${prefix}${important}${simpleMatch[1]}`;

  return undefined;
};

const appendClassValue = (value: ClassValue, tokens: string[]) => {
  if (!value) return;

  if (typeof value === "string" || typeof value === "number") {
    tokens.push(...String(value).split(/\s+/).filter(Boolean));
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) appendClassValue(item, tokens);
    return;
  }

  for (const [key, enabled] of Object.entries(value)) {
    if (enabled) tokens.push(...key.split(/\s+/).filter(Boolean));
  }
};

export function cn(...inputs: ClassValue[]) {
  const tokens: string[] = [];
  for (const input of inputs) appendClassValue(input, tokens);

  const output: string[] = [];
  const indexes = new Map<string, number>();

  for (const token of tokens) {
    const group = conflictGroup(token);
    if (!group) {
      output.push(token);
      continue;
    }

    const previousIndex = indexes.get(group);
    if (previousIndex !== undefined) {
      output.splice(previousIndex, 1);
      for (const [key, index] of indexes) {
        if (index > previousIndex) indexes.set(key, index - 1);
      }
    }

    indexes.set(group, output.length);
    output.push(token);
  }

  return output.join(" ");
}
