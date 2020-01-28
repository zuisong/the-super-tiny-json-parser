// 工具类 返回一对值
class Pair<V1, V2> {
  constructor(public first: V1, public second: V2) {}

  public static of<VV1, VV2>(v1: VV1, v2: VV2): Pair<VV1, VV2> {
    return { first: v1, second: v2 }
  }
}

// 工具方法 校验用
function required<T>(t: T, fn: (t: T) => Boolean, message: string = ''): T {
  if (!fn(t)) {
    throw new Error(message)
  }
  return t
}

export class Token {
  constructor(public type: string, public value: string) {}
}

class JsonNode {
  type?: string
  value?: string | number | Map<string, JsonNode> | JsonNode[]
  key?: string
}

// 把json 字符串 转换为一个token[]
// 这里无关语法规则，不校验任何语法
export function generateTokes(input: string): Array<Token> {
  function getToken(idx: number): Pair<number, Token> {
    let c = input[idx]
    if (c === '{' || c === '}') {
      const t: Token = {
        type: '大括号',
        value: c
      }
      return Pair.of(idx + 1, t)
    }
    if (c === '[' || c === ']') {
      const t: Token = {
        type: '方括号',
        value: c
      }
      return Pair.of(idx + 1, t)
    }
    if (c === ':') {
      const t: Token = {
        type: '冒号',
        value: c
      }
      return Pair.of(idx + 1, t)
    }

    if (c === ',') {
      const t: Token = {
        type: '逗号',
        value: c
      }
      return Pair.of(idx + 1, t)
    }

    const WHITESPACE = new RegExp(`\\s`)
    if (WHITESPACE.test(c)) {
      return Pair.of<number, any>(idx + 1, null)
    }
    // 数字
    const NUMBERS = new RegExp(`\\d`)
    if (NUMBERS.test(c) || c === '-') {
      let value = c
      c = input[idx + value.length]
      while (NUMBERS.test(c)) {
        value += c
        c = input[idx + value.length]
      }
      const t: Token = {
        type: '数字',
        value: value
      }
      return Pair.of(idx + value.length, t)
    }
    /*
     *  json里的引号里面的是字符串
     */
    if (c === `"` || c === `'`) {
      // 保存结束的字符   这里的json可以使用单引号或者双引号作为字符串
      const closeSign = c
      let value = ''
      idx++ // 跳过开始符
      c = input[idx]
      while (c !== closeSign) {
        value += c
        idx++
        c = input[idx]
      }
      const t: Token = {
        type: '字符串',
        value: value
      }
      idx++ // 跳过结束符
      return Pair.of(idx, t)
    }

    const LETTERS = new RegExp(`[a-z]`, 'i')
    if (LETTERS.test(c)) {
      let value = ''

      while (LETTERS.test(c)) {
        value += c
        c = input[idx + value.length]
      }

      const t: Token = {
        type: '名字',
        value
      }
      return Pair.of(idx + value.length, t)
    }

    // Finally if we have not matched a character by now, we're going to throw
    // an error and completely exit.
    throw new TypeError('I dont know what this character is: ' + c)
  }

  let current = 0

  const tokens: Token[] = []
  do {
    const p = getToken(current)
    current = p.first
    if (p.second) {
      tokens.push(p.second)
    }
  } while (current < input.length)

  return tokens
}

export function generateAST(tokens: Token[]) {
  function getNode(idx: number): Pair<number, JsonNode> {
    if (tokens[idx].type === '逗号') {
      idx++
    }

    let t = tokens[idx]
    if (t.type === '大括号' && t.value === '{') {
      idx++ // 跳过大括号节点

      let node = new JsonNode()
      node.type = 'JsonNode'
      node.value = new Map<string, JsonNode>()
      // 大括号处理
      // 保存存有名字token
      while (tokens[idx].type !== '大括号' && tokens[idx].value !== '}') {
        let nameToken = tokens[idx]
        required(
          nameToken,
          it => it.type === '名字' || it.type === '字符串',
          '大括号后面只能跟名字或字符串'
        )
        required(tokens[idx + 1], it => it.type === '冒号', '只能是冒号')
        // 通过递归获取子节点
        const p = getNode(idx + 2)
        node.value.set(nameToken.value, p.second)
        idx = p.first
        if (tokens[idx].type === '逗号') {
          idx++
        }

        required(idx, it => it < tokens.length)
      }
      idx++ // 跳过结尾的反大括号
      return Pair.of(idx, node)
    }

    if (t.type === '方括号' && t.value == '[') {
      idx++
      let node = new JsonNode()
      node.type = 'NODE_ARRAY'
      node.value = new Array<JsonNode>()

      while (tokens[idx].type !== '方括号' && tokens[idx].value !== ']') {
        const p = getNode(idx)
        node.value.push(p.second)

        idx = p.first
        if (tokens[idx].type === '逗号') {
          idx++
        }
      }
      idx++
      return Pair.of(idx, node)
    }

    if (t.type === '数字') {
      const node = new JsonNode()
      node.type = 'NumberValue'
      node.value = Number(t.value)
      return Pair.of(idx + 1, node)
    }

    if (t.type === '字符串') {
      const node = new JsonNode()
      node.type = 'StringValue'
      node.value = t.value
      return Pair.of(idx + 1, node)
    }

    throw new Error(JSON.stringify(t))
  }

  const res = getNode(0)
  required(res.first, it => it === tokens.length, '必须直接到结尾')
  res.second.type = 'ROOT_NODE'

  return res.second
}

export function generateObject(ast: JsonNode) {
  function translate(node: JsonNode) {
    if (node.type === 'NumberValue' || node.type === 'StringValue') {
      return node.value
    }

    if (node.type === 'JsonNode' || node.type === 'ROOT_NODE') {
      const m = <Map<string, JsonNode>>node.value
      const resultMap = new Map()
      // console.log(m.keys())
      const resultObj: any = {}

      m.forEach((value, key: string) => {
        resultMap.set(key, translate(value))
        resultObj[key] = translate(value)
      })

      return resultObj
    }

    if (node.type === 'NODE_ARRAY') {
      const arr = new Array<any>()
      const a = <JsonNode[]>node.value
      a.forEach((value: JsonNode) => {
        arr.push(translate(value))
      })

      return arr
    }

    throw Error(JSON.stringify(node))
  }

  return translate(ast)
}
