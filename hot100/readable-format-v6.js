/* Extra formatting pass for v6 C++ study code.
 * Keeps algorithm behavior unchanged while expanding compressed statements.
 */

function V6_splitCppStatements(line) {
  const pieces = [];
  let current = '';
  let parenDepth = 0;
  let bracketDepth = 0;
  let inSingle = false;
  let inDouble = false;
  let escaped = false;

  for (const char of line) {
    current += char;

    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (!inDouble && char === "'") {
      inSingle = !inSingle;
      continue;
    }
    if (!inSingle && char === '"') {
      inDouble = !inDouble;
      continue;
    }
    if (inSingle || inDouble) continue;

    if (char === '(') parenDepth += 1;
    else if (char === ')') parenDepth -= 1;
    else if (char === '[') bracketDepth += 1;
    else if (char === ']') bracketDepth -= 1;

    if (char === ';' && parenDepth === 0 && bracketDepth === 0) {
      pieces.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) pieces.push(current.trim());
  return pieces;
}

function V6_expandCpp(code) {
  const result = [];

  for (const originalLine of String(code || '').split('\n')) {
    const indent = (originalLine.match(/^\s*/) || [''])[0];
    const body = originalLine.slice(indent.length).trimEnd();

    if (!body) {
      result.push('');
      continue;
    }

    const parts = V6_splitCppStatements(body);
    if (parts.length > 1) {
      for (const part of parts) {
        result.push(`${indent}${part}`);
      }
      continue;
    }

    const inlineIf = body.match(/^if\s*(\(.+\))\s+([^{}].*;)$/);
    if (inlineIf) {
      result.push(`${indent}if ${inlineIf[1]} {`);
      result.push(`${indent}    ${inlineIf[2]}`);
      result.push(`${indent}}`);
      continue;
    }

    const inlineElse = body.match(/^else\s+([^{}].*;)$/);
    if (inlineElse) {
      result.push(`${indent}else {`);
      result.push(`${indent}    ${inlineElse[1]}`);
      result.push(`${indent}}`);
      continue;
    }

    result.push(originalLine);
  }

  return result.join('\n');
}

const V6_cppCodeBeforeFormatting = V6_cppCode;
V6_cppCode = function V6_cppCodeReadable(item) {
  const code = V6_cppCodeBeforeFormatting(item);
  return V6_expandCpp(code);
};

if (typeof DATA !== 'undefined' && DATA.length) {
  render();
}
