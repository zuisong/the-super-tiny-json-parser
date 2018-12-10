export * from './the-super-tiny-json-parser';



// 预期得到的对象
const expectObject =
{
    c: -11,
    d: [
        1,
        {
            f: 'g'
        }
    ]
};

// 预期得的tokens
const expectTokens =
    [
        { type: '大括号', value: '{' },
        { type: '名字', value: 'c' },
        { type: '冒号', value: ':' },
        { type: '数字', value: '-11' },
        { type: '逗号', value: ',' },
        { type: '名字', value: 'd' },
        { type: '冒号', value: ':' },
        { type: '方括号', value: '[' },
        { type: '数字', value: '1' },
        { type: '逗号', value: ',' },
        { type: '大括号', value: '{' },
        { type: '名字', value: 'f' },
        { type: '冒号', value: ':' },
        { type: '字符串', value: 'g' },
        { type: '大括号', value: '}' },
        { type: '方括号', value: ']' },
        { type: '大括号', value: '}' },
    ];


// 原本的json串
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
const tokens = generateTokes(a);

const ast = generateAST(tokens);

const obj = generateObject(ast);

console.log(obj);
