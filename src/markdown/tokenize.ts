/**
 * @file
 * 主要负责分词操作
 */
import type { InlineToken, TitleLevel, Token } from "./type";
import { MarkdownElement, markdownRegex } from "./const";

export function tokenize(markdownText: string) {
    // 将获取到的markdown文本按照行来分割
    const lines = markdownText.split('\n');

    // 用于存储解析出来的token
    const tokens: Token[] = [];
    // 遍历每一行
    for (const line of lines) {
        const trimLine = line.trim();
        // 判断是那种 Markdown 元素
        // 判断是否是标题
        if (trimLine.match(markdownRegex.heading)) {
            // 获取标题的级别
            const level = (trimLine.match(markdownRegex.heading)?.[0].trim().length || 6) as TitleLevel;
            // 创建标题的 token
            tokens.push({
                type: MarkdownElement.Heading,
                level: level,
                content: trimLine.replace(markdownRegex.heading, '').trim(),
                italic: matchItalicText(trimLine),
                delete: matchDeleteText(trimLine),
                inlineCode: matchInlineCodeText(trimLine),
            });
        } else if (trimLine.match(markdownRegex.taskList)) {
            // 1 -, 2 ' ' 或 'x', 3 内容
            const match = markdownRegex.taskList.exec(trimLine);
            const content = match?.[3].trim() ?? '';
            tokens.push({
                type: MarkdownElement.TaskList,
                content,
                checked: match?.[2].trim() === 'x',
                bold: matchBoldText(content),
                italic: matchItalicText(content),
                delete: matchDeleteText(content),
                inlineCode: matchInlineCodeText(content),
            });
        } else if (trimLine.match(markdownRegex.unorderedList)) {
            // 创建无序列表的 token
            tokens.push({
                type: MarkdownElement.ListItem,
                content: trimLine.replace(markdownRegex.unorderedList, '').trim(),
                isOrdered: false,
                bold: matchBoldText(trimLine),
                italic: matchItalicText(trimLine),
                delete: matchDeleteText(trimLine),
                inlineCode: matchInlineCodeText(trimLine),
                link: matchLink(trimLine),
            });
        } else if (trimLine.match(markdownRegex.orderedList)) {
            // 创建有序列表的 token
            tokens.push({
                type: MarkdownElement.ListItem,
                content: trimLine.replace(markdownRegex.orderedList, '').trim(),
                isOrdered: true,
                bold: matchBoldText(trimLine),
                italic: matchItalicText(trimLine),
                delete: matchDeleteText(trimLine),
                inlineCode: matchInlineCodeText(trimLine),
                link: matchLink(trimLine),
            });
        } else if (trimLine.match(markdownRegex.horizontalRule)) {
            // 分割线
            tokens.push({
                type: MarkdownElement.HorizontalRule
            });
        } else if (trimLine.match(markdownRegex.blockquote)) {
            const replace = trimLine.replace('> ', '');
            // 引用
            tokens.push({
                type: MarkdownElement.Blockquote,
                content: replace,
                bold: matchBoldText(trimLine),
                italic: matchItalicText(trimLine),
                delete: matchDeleteText(trimLine),
                inlineCode: matchInlineCodeText(trimLine),
                link: matchLink(trimLine),
            });
        } else if (trimLine.match(markdownRegex.image)) {
            const match = markdownRegex.image.exec(trimLine);
            tokens.push({
                type: MarkdownElement.Image,
                content: match?.[2].trim() ?? '',
                title: match?.[1].trim() ?? ''
            })
        } else if (trimLine !== '') {
            // 如果该行不是空行，则视为段落
            tokens.push({
                type: MarkdownElement.Paragraph,
                content: trimLine,
                bold: matchBoldText(trimLine),
                italic: matchItalicText(trimLine),
                delete: matchDeleteText(trimLine),
                inlineCode: matchInlineCodeText(trimLine),
                link: matchLink(trimLine),
            });
        }
    }

    return tokens;
}

/** 匹配加粗格式 */
function matchBoldText(text: string) {
    return matchText(text, markdownRegex.bold, MarkdownElement.Bold);
}

/** 匹配斜体格式 */
function matchItalicText(text: string) {
    return matchText(text, markdownRegex.italic, MarkdownElement.Italic);
}

/** 匹配删除线格式 */
function matchDeleteText(text: string) {
    return matchText(text, markdownRegex.delete, MarkdownElement.Delete);
}

/** 匹配行内代码格式 */
function matchInlineCodeText(text: string) {
    return matchText(text, markdownRegex.inlineCode, MarkdownElement.InlineCode);
}

function matchText(text: string, regex: RegExp, type: InlineToken['type']) {
    const list: InlineToken[] = [];
    const matchs = text.matchAll(regex);

    for (const match of matchs) {
        // 0位是完整匹配项，1/2位是内容
        // 由于我们使用了|来分隔两个模式，所以只有一个捕获组会有内容
        list.push({
            type: type,
            content: match[1] || match[2],
            match: match[0]
        });
    }

    return list;
}

/** 匹配行内链接，需要带其他数据，所以单独拿出一个函数 */
function matchLink(text: string) {
    const list: InlineToken[] = [];
    const matchs = text.matchAll(markdownRegex.link);

    for (const match of matchs) {
        // href中可能带有标题
        const hrefMatch = match[2];
        // 单独匹配上标题
        const titleMatch = hrefMatch.match(/^([^"]*)\s*"([^"]*)"$/);

        list.push({
            type: MarkdownElement.Link,
            content: match[1],
            match: match[0],
            href: titleMatch?.[1].trim() ?? hrefMatch.trim(),
            title: titleMatch?.[2] ?? ''
        });
    }

    return list;
}