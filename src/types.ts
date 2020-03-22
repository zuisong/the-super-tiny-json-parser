export enum TokenType {
  大括号 = "大括号",
  方括号 = "方括号",
  冒号 = "冒号",
  逗号 = "逗号",
  名字 = "名字",
  数字 = "数字",
  字符串 = "字符串"
}

export enum JsonNodeType {
  ROOT_NODE = "1",
  JSON_OBJ = "2",
  JSON_ARRAY = "3",
  NUMBER = "4",
  STRING = "5"
}

export interface Token {
  type: TokenType;
  value: string;
}

// 工具方法 校验用
export function required<T>(
  t: T,
  fn: (t: T) => Boolean,
  message: string = ""
): T {
  if (!fn(t)) {
    throw new Error(message);
  }
  return t;
}

export interface Pair<V1, V2> {
  first: V1;
  second: V2;
}

export interface JsonNode {
  type?: JsonNodeType;
  value?: string | number | Map<string, JsonNode> | JsonNode[];
  key?: string;
}
