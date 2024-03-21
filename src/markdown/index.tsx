import { tokenize } from "./tokenize";
import { parse } from './parse';
import { GenerateHtml } from './generate-html';

const markdownText = `
# 标题

这是一个段落。

- 无序列表项 1
- 无序列表项 2
- 无序列表项 3

这是第二个段落

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

`;

export default function MarkdownToHtml() {
    // 分词，解析为tokens
    const tokens = tokenize(markdownText);

    // 根据上一步所得到的tokens，形成抽象语法树
    const ast = parse(tokens);
    console.log(ast)

    // 遍历抽象语法树，生成html字符串
    // const html = generateHtml(ast);

    return (
        <>
            <GenerateHtml node={ast} />
        </>
    );
}