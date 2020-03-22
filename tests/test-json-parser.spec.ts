import {generateAst, generateObject, generateTokes} from "../index";
import {assert} from "chai";


describe("json parser", () => {


// 原本的json串
// language=json
  const a = `
    {
      c: -11,
      d: [
        1,
        {
          f: 'g'
        }
      ]
    }
  `;

// 预期得到的对象
  const expectObject = {
    c: -11,
    d: [
      1,
      {
        f: "g"
      }
    ]
  };

// 预期得的tokens
  const expectTokens = [
    {type: "大括号", value: "{"},
    {type: "名字", value: "c"},
    {type: "冒号", value: ":"},
    {type: "数字", value: "-11"},
    {type: "逗号", value: ","},
    {type: "名字", value: "d"},
    {type: "冒号", value: ":"},
    {type: "方括号", value: "["},
    {type: "数字", value: "1"},
    {type: "逗号", value: ","},
    {type: "大括号", value: "{"},
    {type: "名字", value: "f"},
    {type: "冒号", value: ":"},
    {type: "字符串", value: "g"},
    {type: "大括号", value: "}"},
    {type: "方括号", value: "]"},
    {type: "大括号", value: "}"}
  ];

  it("generateTokes", () => {
    const tokens = generateTokes(a);
    assert.deepStrictEqual(tokens, expectTokens, "token 转换不符合预期");
  })
  it("generateAST", () => {
    const ast = generateAst(expectTokens);
    const obj = generateObject(ast);
    assert.deepStrictEqual(obj, expectObject, "对象转换不对");
  })


})
