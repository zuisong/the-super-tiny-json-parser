import { assert } from 'chai'
import { parseJson } from '../src/the-super-tiny-json-parser'

describe('json parser', () => {
  it('parse json', () => {
    // 原本的json串
    // language=json
    const json = `
  {
    c: -11,
    d: [
      1,
      {
        f: 'g'
      }
    ]
  }
`

    // 预期得到的对象
    const expectObject = {
      c: -11,
      d: [
        1,
        {
          f: 'g',
        },
      ],
    }
    const obj = parseJson(json)
    assert.deepStrictEqual(obj, expectObject, '对象转换不对')
  })
  it('parse boolean (true)', () => {
    const result = parseJson('true')
    assert.equal(result, true)
  })

  it('parse boolean (false)', () => {
    const result = parseJson('false')
    assert.equal(result, false)
  })

  it('parst int (1)', () => {
    const result = parseJson('1')
    assert.equal(result, 1)
  })
  it('parst int (-1)', () => {
    const result = parseJson('-1')
    assert.equal(result, -1)
  })

  it('parst array 1', () => {
    const result = parseJson('[-1,-2,-1]')
    assert.deepEqual(result, [-1, -2, -1])
  })

  it('parst array 2', () => {
    const result = parseJson(`[-1,-2,'-1']`)
    assert.deepEqual(result, [-1, -2, '-1'])
  })
})
