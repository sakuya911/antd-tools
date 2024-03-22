// 该文件根据传入的 tokens 列表生成抽象语法树

import { Token } from './type';
import { MarkdownElement } from './const';

export enum ParserNodeType {
    Root = 'root',
    Heading = 'heading',
    Paragraph = 'paragraph',
    OrderedList = 'orderedList',
    UnorderedList = 'unordered-list',
    ListItem = 'listItem',
    // BulletList = 'bulletList',
    // CodeBlock = 'codeBlock',
    // ThematicBreak = 'thematicBreak',
    // HTMLBlock = 'htmlBlock',
    // HTMLSpan = 'htmlSpan',
    // Text = 'text',
}

export interface ParseAST {
    type: ParserNodeType;
    children?: ParseAST[];
    content?: string;
    ordered?: boolean;
    level?: 1 | 2 | 3 | 4 | 5 | undefined;
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
                currentList = null;
                // 标题和段落实际处理一致
                ast.children!.push({
                    type: ParserNodeType.Paragraph,
                    content: token.content,
                });
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