import { JsonNodeType } from "./json-node-type";

export interface JsonNode {
  type?: JsonNodeType;
  value?: string | number | Map<string, JsonNode> | JsonNode[];
  key?: string;
}
