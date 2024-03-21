/**
 * @file
 * 主要负责分词操作
 */
import type { Token } from "./type";
import { MarkdownElement } from "./const";

export function tokenize(markdownText: string) {
    // 将获取到的markdown文本按照行来分割
    const lines = markdownText.split('\n');

    // 用于存储解析出来的token
    const tokens: Token[] = [];
    // 遍历每一行
    for (const line of lines) {
        // 判断是那种 Markdown 元素
        // 判断是否是标题
        if (line.match(/^\s*#{1,6}\s+/)) {
            // 获取标题的级别
            const level = line.match(/^\s*#{1,6}\s+/)?.[0].trim().length || 0;
            // 创建标题的 token
            tokens.push({
                type: MarkdownElement.Heading,
                level: level,
                content: line.replace(/^\s*#{1,6}\s+/, '').trim()
            });
        } else if (line.match(/^\s*[-+*]\s+/)) {
            // 创建无序列表的 token
            tokens.push({
                type: MarkdownElement.ListItem,
                content: line.replace(/^\s*[-+*]\s+/, '').trim(),
                isOrdered: false,
            });
        } else if (line.match(/^\s*\d+\.\s+/)) {
            // 创建有序列表的 token
            tokens.push({
                type: MarkdownElement.ListItem,
                content: line.replace(/^\d+\./, '').trim(),
                isOrdered: true,
            });
        } else if (line.trim() !== '') {
            // 如果该行不是空行，则视为段落
            tokens.push({
                type: MarkdownElement.Paragraph,
                content: line.trim()
            });
        }
    }

    return tokens;
}