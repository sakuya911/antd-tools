/**
 * @file
 * 主题切换功能
 */

import { Divider, Dropdown, Space, theme, MenuProps } from "antd";
import React from "react";
import useThemeHook from "../hooks/useThemeHook";
import { AppstoreTwoTone } from "@ant-design/icons";
import { markdownRegex } from "../const";

const { useToken } = theme;

export default function Themes({
    setMarkdownText,
    markdownText,
}: {
    setMarkdownText: (value: string) => void;
    markdownText: string;
}) {

    const items: MenuProps["items"] = [
        { key: "default", label: "默认主题" },
        { key: "juejin", label: "juejin" },
        { key: "github", label: "github" },
    ];
    // 判断当前主题
    useThemeHook(markdownText);

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
    // theme下拉菜单点击事件
    const onClick: MenuProps["onClick"] = ({ key }) => {
        // 默认主题清空主题相关文字
        if (key === "default") {
            setMarkdownText(markdownText.replace(markdownRegex.themeArea, ""));
            return 1;
        }
        // 获取当前使用的主题
        const themesList = markdownText
            ?.match(markdownRegex.themeArea)?.[1]
            ?.split("\n");
        const themes = themesList?.find((one: string) =>
            markdownRegex.themeText.test(one)
        );
        const theme = themes?.split(":")[1]?.trim();
        // 如果已有主题，替换旧主题文字
        if (theme) {
            setMarkdownText(
                markdownText.replace(
                    markdownRegex.themeArea,
                    `---\ntheme: ${key}\n---`
                )
            );
        } else {
            // 新主题加入markdown内容主体
            const themeString = `---\ntheme: ${key}\n---`;
            const newMarkdownText = themeString + markdownText;
            setMarkdownText(newMarkdownText);
        }
    };
    return (
        <>
            <Dropdown
                menu={{ items, onClick }}
                dropdownRender={(menu) => (
                    <div style={contentStyle}>
                        <Space className="py-2 px-4">
                            <span className="font-sans">Markdown 主题</span>
                        </Space>
                        <div className="px-3">
                            <Divider className="m-0" />
                        </div>
                        {React.cloneElement(menu as React.ReactElement, {
                            style: menuStyle,
                        })}
                    </div>
                )}>
                <AppstoreTwoTone className="text-base rounded hover:bg-sky-200 p-1" />
            </Dropdown>
        </>
    );
}
