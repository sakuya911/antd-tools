// 该文件根据传入的 tokens 列表生成抽象语法树

import type { InlineToken, ParagraphToken, TitleLevel, Token } from './type';
import { MarkdownElement } from './const';

export enum ParserNodeType {
    Root = 'root',
    Heading = 'heading',
    Paragraph = 'paragraph',
    OrderedList = 'orderedList',
    UnorderedList = 'unorderedList',
    ListItem = 'listItem',
    Bold = 'bold',
    Text = 'text',
    Italic = 'italic',
    InlineCode = 'inlineCode',
    Delete = 'delete',
    HorizontalRule = 'horizontalRule',
    Blockquote = 'blockquote',
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
            case MarkdownElement.HorizontalRule:
                currentList = null;
                ast.children!.push({
                    type: ParserNodeType.HorizontalRule,
                });
                break;
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
                if (!currentList || Object.prototype.hasOwnProperty.call(currentList, 'ordered')) {
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
            case MarkdownElement.Blockquote:
                // 引用块
                if (!currentList || currentList.type !== ParserNodeType.Blockquote) {
                    currentList = {
                        type: ParserNodeType.Blockquote,
                        children: [],
                    };
                    ast.children!.push(currentList);
                }
                currentList.children!.push(parseParagraph({
                    ...token,
                    type: MarkdownElement.Paragraph,
                }));
                break;
            default:
                break;
        }
    });

    console.log('parse', ast);

    return ast;
}

/** 解析段落 */
function parseParagraph<T extends ParagraphToken>(token: T, type: ParserNodeType = ParserNodeType.Paragraph) {
    const result: ParseAST = {
        type,
        content: token.content ?? '',
        children: [{
            type: ParserNodeType.Text,
            content: token.content
        }]
    }

    if (token.inlineCode?.length) {
        result.children = splitToAST(result.children!, token.inlineCode, ParserNodeType.InlineCode);
    }

    if (token.bold?.length) {
        result.children = splitToAST(result.children!, token.bold, ParserNodeType.Bold);
    }

    if (token.delete?.length) {
        result.children = splitToAST(result.children!, token.delete, ParserNodeType.Delete);
    }

    if (token.italic?.length) {
        result.children = splitToAST(result.children!, token.italic, ParserNodeType.Italic);
    }

    return result;
}

function splitToAST(rootChildren: ParseAST[], tokenList: InlineToken[], type: ParserNodeType) {
    const result: ParseAST[] = [];
    rootChildren.forEach(childText => {
        // 已经处理过的数据直接放入数组
        if (childText.type !== ParserNodeType.Text) {
            result.push(childText);
            return;
        }
        let content = childText.content ?? '';
        tokenList.forEach(item => {

            // 匹配Text类型的数据
            const index = content.indexOf(item.match);

            // 未匹配上
            if (index === -1) {
                return;
            }

            // 开头未匹配上，不管了，直接进去
            if (index > 0) {
                result.push({
                    type: ParserNodeType.Text,
                    content: content.slice(0, index)
                })
            }

            // 将匹配上的数据放入数组
            result.push({
                type,
                content: item.content
            })

            // 切掉之前匹配上的数据，重新走流程
            content = content.slice(index + item.match.length);
        });

        // 如果最终还有剩余的文字（未匹配上），则直接加进去
        if (content) {
            result.push({
                type: ParserNodeType.Text,
                content: content
            })
        }
    });
    return result;
}