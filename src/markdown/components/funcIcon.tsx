/**
 * @file
 * 暂且用作功能栏，后续可扩展
 */

import Themes from "./themes";

export default function FuncIcon({
    setMarkdownText,
    markdownText,
}: {
    setMarkdownText: (value: string) => void;
    markdownText: string;
}) {
    return (
        <>
            <div className="funcIcon">
                <Themes
                    markdownText={markdownText}
                    setMarkdownText={setMarkdownText}
                />
            </div>
        </>
    );
}
