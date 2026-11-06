import { generateTokes } from "./generate-tokes.ts";
import { generateAst } from "./generate-ast.ts";
import { generateObject } from "./generate-object.ts";
import type { GenerateResult } from "./types.ts";

export function parseJson(input: string): GenerateResult {
  const tokens = generateTokes(input);
  const ast = generateAst(tokens);
  const result = generateObject(ast);
  return result;
}
