export const TokenType = {
  BIG: "BIG", // '大括号',
  SQUARE: "SQUARE", // '方括号',
  COLON: "COLON", // '冒号',
  COMMA: "COMMA", // '逗号',
  IDENTIFY: "IDENTIFY", // '标识符',
  NUMBER: "NUMBER", // '数字',
  BOOLEAN: "BOOLEAN", // '布尔',
  STRING: "STRING", // '字符串',
} as const;

export const JsonNodeType = {
  JSON_OBJECT: "JSON_OBJECT",
  JSON_ARRAY: "JSON_ARRAY",
  NUMBER: "NUMBER",
  STRING: "STRING",
  BOOLEAN: "BOOLEAN",
} as const;

export type Token = {
  type: keyof typeof TokenType;
  value: string;
};

export type Pair<V1, V2> = {
  first: V1;
  second: V2;
};

export type JsonNodeValue =
  string | number | boolean | Map<string, JsonNode> | Array<JsonNode>;

export type JsonNode = {
  type: keyof typeof JsonNodeType;
  value: JsonNodeValue;
};

export type GenerateResult =
  | string
  | number
  | boolean
  | { [key: string]: GenerateResult }
  | Array<GenerateResult>;
