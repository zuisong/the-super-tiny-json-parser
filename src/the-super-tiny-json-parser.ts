import { generateTokes } from './generate-tokes'
import { generateAst } from './generate-ast'
import { generateObject } from './generate-object'

export function parseJson(input: string): GenerateResult {
  const tokens = generateTokes(input)
  const ast = generateAst(tokens)
  const result = generateObject(ast)
  return result
}
