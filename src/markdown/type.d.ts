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

interface LinkToken extends ExtraTokenBase {
    type: MarkdownElement.Link;
    href?: string;
    title?: string;
}

export type InlineToken = BoldToken | ItalicToken | InlineCodeToken | DeleteToken | LinkToken;

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
    /** 链接 */
    link?: InlineToken[];
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

/** 任务列表 */
interface TaskListToken extends ParagraphToken {
    type: MarkdownElement.TaskList;
    checked: boolean;
}
interface ImageToken {
    type: MarkdownElement.Image;
    content: string;
    title?: string;
}

export type Token = ParagraphToken | ListItemToken | HeadingToken | BlockquoteToken | HorizontalRuleToken | ImageToken | TaskListToken;