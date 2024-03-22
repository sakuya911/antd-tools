// 该文件根据传入的 tokens 列表生成抽象语法树

import { TitleLevel, Token } from './type';
import { MarkdownElement } from './const';

export enum ParserNodeType {
    Root = 'root',
    Heading = 'heading',
    Paragraph = 'paragraph',
    OrderedList = 'orderedList',
    UnorderedList = 'unordered-list',
    ListItem = 'listItem',
    Bold = 'bold',
    Text = 'text',
    // BulletList = 'bulletList',
    // CodeBlock = 'codeBlock',
    // ThematicBreak = 'thematicBreak',
    // HTMLSpan = 'htmlSpan',
}

export interface ParseAST {
    type: ParserNodeType;
    children?: ParseAST[];
    content?: string;
    ordered?: boolean;
    level?: TitleLevel;
}

export function parse(tokens: Token[]) {
    // 初始化抽象语法树的根节点
    const ast: ParseAST = {
        type: ParserNodeType.Root,
        children: [] as ParseAST[],
        content: ''
    }

    let currentList: ParseAST | null;

    // 遍历所有的token
    tokens.forEach((token) => {
        switch (token.type) {
            case MarkdownElement.Heading:
                currentList = null;
                // 标题和段落实际处理一致
                ast.children!.push({
                    type: ParserNodeType.Heading,
                    content: token.content,
                    level: token.level,
                });
                break;
            case MarkdownElement.Paragraph:
                // 段落处理
                currentList = null;
                ast.children!.push(parseParagraph(token));
                break;
            case MarkdownElement.ListItem:
                // 当遇到列表的时候，需要创建列表的父元素
                if (!currentList) {
                    currentList = {
                        type: token.isOrdered ? ParserNodeType.OrderedList : ParserNodeType.UnorderedList,
                        children: [],
                        ordered: token.isOrdered
                     };
                     ast.children?.push(currentList)
                }

                // 接下来将当前的列表推入到列表数组中
                currentList.children?.push({
                    type: ParserNodeType.ListItem,
                    content: token.content
                });
                break;
            default:
                break;
        }
    });

    return ast;
}

function parseParagraph(token: Token) {
    const result: ParseAST = {
        type: ParserNodeType.Paragraph,
        content: token.content,
        children: []
    }

    if (token.bold?.length) {
        let content = token.content;
        token.bold.forEach((item) => {
            const index = content.indexOf(item.match);

            if (index > 0) {
                result.children?.push({
                    type: ParserNodeType.Text,
                    content: content.slice(0, index)
                })
            }
            
            result.children?.push({
                type: ParserNodeType.Bold,
                content: item.content
            })
            content = content.slice(index + item.match.length);
            console.info('parseParagraph', content);
        })

        // 如果最终还有剩余的文字，则直接加进去
        if (content) {
            result.children?.push({
                type: ParserNodeType.Text,
                content: content
            })
        }
    }
    return result;
}