import {
  JsonNode,
  JsonNodeType,
  Pair,
  required,
  Token,
  TokenType,
} from './types'

export function generateAst(tokens: Token[]) {
  function getNode(idx: number): Pair<number, JsonNode> {
    if (tokens[idx].type === TokenType.COMMA) {
      idx++
    }

    const t = tokens[idx]
    if (t.type === TokenType.BIG && t.value === '{') {
      idx++ // 跳过大括号节点

      const node = {} as JsonNode
      node.type = JsonNodeType.JSON_OBJECT
      node.value = new Map<string, JsonNode>()
      // 大括号处理
      // 保存存有名字token
      while (tokens[idx].type !== TokenType.BIG && tokens[idx].value !== '}') {
        const nameToken = tokens[idx]
        required(
          nameToken,
          it => it.type === TokenType.IDENTIFY || it.type === TokenType.STRING,
          '大括号后面只能跟名字或字符串'
        )
        required(
          tokens[idx + 1],
          it => it.type === TokenType.COLON,
          '只能是冒号'
        )
        // 通过递归获取子节点
        const p = getNode(idx + 2)
        node.value.set(nameToken.value, p.second)
        idx = p.first
        if (tokens[idx].type === TokenType.COMMA) {
          idx++
        }

        required(idx, it => it < tokens.length)
      }
      idx++ // 跳过结尾的反大括号
      return {
        first: idx,
        second: node,
      }
    }

    if (t.type === TokenType.SQUARE && t.value == '[') {
      idx++
      const node = {} as JsonNode
      node.type = JsonNodeType.JSON_ARRAY
      node.value = new Array<JsonNode>()

      while (
        tokens[idx].type !== TokenType.SQUARE &&
        tokens[idx].value !== ']'
      ) {
        const p = getNode(idx)
        node.value.push(p.second)

        idx = p.first
        if (tokens[idx].type === TokenType.COMMA) {
          idx++
        }
      }
      idx++
      return {
        first: idx,
        second: node,
      }
    }

    if (t.type === TokenType.NUMBER) {
      const node = {} as JsonNode
      node.type = JsonNodeType.NUMBER
      node.value = Number(t.value)
      return {
        first: idx + 1,
        second: node,
      }
    }

    if (t.type === TokenType.STRING) {
      const node = {} as JsonNode
      node.type = JsonNodeType.STRING
      node.value = t.value
      return {
        first: idx + 1,
        second: node,
      }
    }

    if (t.type === TokenType.BOOLEAN) {
      const node = {} as JsonNode
      node.type = JsonNodeType.BOOLEAN
      node.value = t.value === 'true'
      return {
        first: idx + 1,
        second: node,
      }
    }

    throw new Error(JSON.stringify(t))
  }

  const res = getNode(0)
  required(res.first, it => it === tokens.length, '必须直接到结尾')

  return res.second
}
