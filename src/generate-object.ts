import { JsonNode, JsonNodeType } from './types'

export function generateObject(ast: JsonNode) {
  function translate(node: JsonNode) {
    if (node.type === JsonNodeType.NUMBER || node.type === JsonNodeType.STRING) {
      return node.value
    }

    if (node.type === JsonNodeType.JSON_OBJ || node.type === JsonNodeType.ROOT_NODE) {
      const m = node.value as Map<string, JsonNode>
      const resultMap = new Map()
      // console.log(m.keys())
      const resultObj: any = {}

      m.forEach((value, key: string) => {
        resultMap.set(key, translate(value))
        resultObj[key] = translate(value)
      })

      return resultObj
    }

    if (node.type === JsonNodeType.JSON_ARRAY) {
      const arr = new Array<any>()
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
