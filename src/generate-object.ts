
export function generateObject(ast: JsonNode): GenerateResult {
  function translate(node: JsonNode): GenerateResult {
    if (
      node.type === JsonNodeType.NUMBER ||
      node.type === JsonNodeType.STRING ||
      node.type === JsonNodeType.BOOLEAN
    ) {
      return node.value as string | number | boolean
    }

    if (node.type === JsonNodeType.JSON_OBJECT) {
      const m = node.value as Map<string, JsonNode>
      const resultObj: {
        [key: string]: GenerateResult
      } = {}

      m.forEach((value: JsonNode, key: string) => {
        resultObj[key] = translate(value)
      })

      return resultObj
    }

    if (node.type === JsonNodeType.JSON_ARRAY) {
      const arr = new Array<GenerateResult>()
      const a = node.value as JsonNode[]
      a.forEach((value: JsonNode) => {
        arr.push(translate(value))
      })

      return arr
    }

    throw Error(JSON.stringify(node))
  }

  return translate(ast)
}
