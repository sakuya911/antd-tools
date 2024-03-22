import { tokenize } from "./tokenize";
import { parse } from './parse';
import { GenerateHtml } from './generate-html';
import { Input, Typography } from 'antd';
import { useState } from "react";
import MarkdownBg from './img/markdown.jpg';

const { TextArea } = Input;

// const markdownText = `
// # 标题

// 这是一个段落。

// - 无序列表项 1
// - 无序列表项 2
// - 无序列表项 3

// 这是第二个段落

// 1. 有序列表项 1
// 2. 有序列表项 2
// 3. 有序列表项 3

// `;

function MarkdownInput({ onChange }: { onChange: (value: string) => void }) {
    function handleChangeText(e: React.ChangeEvent<HTMLTextAreaElement>) {
        onChange(e.target.value);
    }
    return (
        <>
            <div className="h-full">
                <TextArea
                    placeholder="Write markdown"
                    style={{ height: '100%', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    onChange={handleChangeText} />
            </div>
        </>
    )
}

export default function MarkdownToHtml() {
    const [markdownText, setMarkdownText] = useState('');
    // 分词，解析为tokens
    const tokens = tokenize(markdownText);

    // 根据上一步所得到的tokens，形成抽象语法树
    const ast = parse(tokens);
    console.log(ast)

    const style = {
        backdropFilter: "blur(10px)",
        backgroundImage: `url(${MarkdownBg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <>
            <div className="h-full w-full flex backdrop-opacity-10 backdrop-invert rounded" style={style}>
                <div style={{ flex: '0 0 32rem'}}>
                    <MarkdownInput onChange={setMarkdownText} />
                </div>
                <Typography className="w-full p-2 text-left border
                border-stone-300 border-solid rounded"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    <GenerateHtml node={ast} />
                </Typography>
            </div>
        </>
    );
}