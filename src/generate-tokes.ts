// 这里无关语法规则，不校验任何语法
import { Pair, Token, TokenType } from './types'

export function generateTokes(input: string): Array<Token> {
  function getToken(idx: number): Pair<number, Token> {
    let c = input[idx]
    if (c === '{' || c === '}') {
      const t: Token = {
        type: TokenType.大括号,
        value: c,
      }
      return { first: idx + 1, second: t }
    }
    if (c === '[' || c === ']') {
      const t: Token = {
        type: TokenType.方括号,
        value: c,
      }
      return { first: idx + 1, second: t }
    }
    if (c === ':') {
      const t: Token = {
        type: TokenType.冒号,
        value: c,
      }
      return { first: idx + 1, second: t }
    }

    if (c === ',') {
      const t: Token = {
        type: TokenType.逗号,
        value: c,
      }
      return { first: idx + 1, second: t }
    }

    const WHITESPACE = new RegExp(`\\s`)
    if (WHITESPACE.test(c)) {
      return { first: idx + 1, second: null }
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
        type: TokenType.数字,
        value: value,
      }
      return { first: idx + value.length, second: t }
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
        type: TokenType.字符串,
        value: value,
      }
      idx++ // 跳过结束符
      return { first: idx, second: t }
    }

    const LETTERS = new RegExp(`[a-z]`, 'i')
    if (LETTERS.test(c)) {
      let value = ''

      while (LETTERS.test(c)) {
        value += c
        c = input[idx + value.length]
      }

      const t: Token = {
        type: TokenType.名字,
        value,
      }
      return { first: idx + value.length, second: t }
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
