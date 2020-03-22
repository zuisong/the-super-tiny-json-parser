import { TokenType } from "./token-type";

export interface Token {
  type: TokenType;
  value: string;
}
