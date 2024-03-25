import { MarkdownElement } from './const'

// 标题等级类型
export type TitleLevel =  1 | 2 | 3 | 4 | 5 | undefined;

interface ExtraTokenBase {
    content: string;
    match: string;
}

interface BoldToken extends ExtraTokenBase {
    type: MarkdownElement.Bold;
}

interface ItalicToken extends ExtraTokenBase {
    type: MarkdownElement.Italic;
}
interface InlineCodeToken extends ExtraTokenBase {
    type: MarkdownElement.InlineCode;
}

interface DeleteToken extends ExtraTokenBase {
    type: MarkdownElement.Delete;
}

export type InlineToken = BoldToken | ItalicToken | InlineCodeToken | DeleteToken;

// 额外的格式
interface ExtraToken {
    /** 加粗 */
    bold?: InlineToken[];
    /** 斜体 */
    italic?: InlineToken[];
    /** 行内代码 */
    inlineCode?: InlineToken[];
    /** 删除线 */
    delete?: InlineToken[];
}

/** 段落 */
interface ParagraphToken extends ExtraToken {
    type: MarkdownElement.Paragraph;
    content: string;
}

/** 列表 */
interface ListItemToken extends ParagraphToken {
    type: MarkdownElement.ListItem;
    isOrdered: boolean;
}

/** 标题 */
interface HeadingToken extends ParagraphToken {
    type: MarkdownElement.Heading;
    level: TitleLevel;
}

/** 引用块 */
interface BlockquoteToken extends ParagraphToken {
    type: MarkdownElement.Blockquote;
}

interface HorizontalRuleToken {
    type: MarkdownElement.HorizontalRule;
}

export type Token = ParagraphToken | ListItemToken | HeadingToken | BlockquoteToken | HorizontalRuleToken;