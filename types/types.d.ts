declare enum TokenType {
  BIG = '大括号',
  SQUARE = '方括号',
  COLON = '冒号',
  COMMA = '逗号',
  IDENTIFY = '标识符',
  NUMBER = '数字',
  BOOLEAN = '布尔',
  STRING = '字符串',
}

declare enum JsonNodeType {
  JSON_OBJECT = 1,
  JSON_ARRAY = 2,
  NUMBER = 4,
  STRING = 8,
  BOOLEAN = 16,
}

declare type Token = {
  type: TokenType
  value: string
}

declare type Pair<V1, V2> = {
  first: V1
  second: V2
}

declare type JsonNodeValue =
  | string
  | number
  | boolean
  | Map<string, JsonNode>
  | Array<JsonNode>

declare type JsonNode = {
  type: JsonNodeType
  value: JsonNodeValue
}

declare type GenerateResult =
  | string
  | number
  | boolean
  | { [key: string]: GenerateResult }
  | Array<GenerateResult>
