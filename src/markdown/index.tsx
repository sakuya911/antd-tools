import { tokenize } from "./utils/tokenize";
import { parse } from './utils/parse';
import GenerateHtml from './components/generate-html';
import { Input, Typography } from 'antd';
import { useState } from "react";
import MarkdownBg from './img/markdown.jpg';
import { textDemo } from "./const";

const { TextArea } = Input;

function MarkdownInput({ onChange, defaultValue }: {
    onChange: (value: string) => void;
    defaultValue?: string
}) {
    return (
        <>
            <div className="h-full">
                <TextArea
                    defaultValue={defaultValue}
                    placeholder="Write markdown"
                    style={{ height: '100%', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                    onChange={e => {
                        onChange(e.target.value);
                    }} />
            </div>
        </>
    )
}

export default function MarkdownToHtml() {
    const [markdownText, setMarkdownText] = useState(textDemo);
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
                <div style={{ flex: `0 0 40rem`}}>
                    <MarkdownInput defaultValue={markdownText} onChange={setMarkdownText} />
                </div>
                <Typography className="w-full p-2 text-left border
                border-stone-300 border-solid rounded"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        overflow: 'auto',
                    }}>
                    <GenerateHtml node={ast} />
                </Typography>
            </div>
        </>
    );
}