import { tokenize } from "./utils/tokenize";
import { parse } from "./utils/parse";
import GenerateHtml from "./components/generate-html";
import type { MenuProps } from "antd";
import { Input, Typography, Divider, Dropdown, Space, theme } from "antd";
import { useState } from "react";
import React from "react";
import MarkdownBg from "./img/markdown.jpg";
import { textDemo } from "./const";
import { AppstoreTwoTone } from "@ant-design/icons";
const { useToken } = theme;
const { TextArea } = Input;

function MarkdownInput({
    onChange,
    value,
}: {
    onChange: (value: string) => void;
    value?: string;
}) {
    return (
        <>
            <div className="h-full">
                <TextArea
                    value={value}
                    placeholder="Write markdown"
                    style={{
                        height: "100%",
                        resize: "none",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                    }}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                />
            </div>
        </>
    );
}

export default function MarkdownToHtml() {
    let [markdownText, setMarkdownText] = useState(textDemo);
    const items: MenuProps["items"] = [
        { key: "default", label: "默认主题" },
        { key: "juejin", label: "juejin" },
        { key: "github", label: "github" },
    ];
    // 分词，解析为tokens
    const tokens = tokenize(markdownText);

    // 根据上一步所得到的tokens，形成抽象语法树
    const ast = parse(tokens);
    console.log(ast);

    // theme下拉菜单样式相关
    const { token } = useToken();
    const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };
    const menuStyle: React.CSSProperties = {
        boxShadow: "none",
    };
    const style = {
        backdropFilter: "blur(10px)",
        backgroundImage: `url(${MarkdownBg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
    };
    // theme下拉菜单点击事件
    const onClick: MenuProps["onClick"] = ({ key }) => {
        // 默认主题清空主题相关文字
        if (key === "default") {
            setMarkdownText(markdownText.replace(/^---\n([\s\S]*?)\n---/, ""));
            return 1;
        }
        // 获取当前使用的主题
        const themesList = markdownText
            ?.match(/^---\n([\s\S]*?)\n---/)?.[1]
            ?.split("\n");
        const themes = themesList?.find((one) =>
            /^[^:]*theme\:[\s\S]*/.test(one)
        );
        const theme = themes?.split(":")[1]?.trim();
        // 如果已有主题，替换旧主题文字
        if (theme) {
            setMarkdownText(
                markdownText.replace(
                    /^---\n([\s\S]*?)\n---/,
                    `---\ntheme: ${key}\n---`
                )
            );
        } else {
            // 新主题加入markdown内容主体
            let themeString = `---\ntheme: ${key}\n---`;
            let newMarkdownText = themeString + markdownText;
            setMarkdownText(newMarkdownText);
        }
    };
    return (
        <>
            <div
                className="h-full w-full flex flex-col backdrop-opacity-10 backdrop-invert rounded-lg border border-solid border-slate-300"
                style={style}>
                <div
                    className="px-2 py-2 flex rounded-t-lg"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                    }}>
                    <div className="funcIcon">
                        <Dropdown
                            menu={{ items, onClick }}
                            dropdownRender={(menu) => (
                                <div style={contentStyle}>
                                    <Space className="py-2 px-4">
                                        <span className="font-sans">
                                            Markdown 主题
                                        </span>
                                    </Space>
                                    <div className="px-3">
                                        <Divider className="m-0" />
                                    </div>
                                    {React.cloneElement(
                                        menu as React.ReactElement,
                                        { style: menuStyle }
                                    )}
                                </div>
                            )}>
                            <AppstoreTwoTone className="text-base rounded hover:bg-sky-200 p-1" />
                        </Dropdown>
                    </div>
                </div>
                <div
                    className="w-full flex"
                    style={{ height: "calc(100% - 40px)" }}>
                    <div style={{ flex: `0 0 50%` }}>
                        <MarkdownInput
                            value={markdownText}
                            onChange={setMarkdownText}
                        />
                    </div>
                    <Typography
                        className="markdown-body w-full p-2 text-left border border-stone-300 border-solid rounded"
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            overflow: "auto",
                        }}>
                        <GenerateHtml node={ast} />
                    </Typography>
                </div>
            </div>
        </>
    );
}
