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

interface ParagraphToken extends ExtraToken {
    type: MarkdownElement.Paragraph;
    content: string;
}

interface ListItemToken extends ExtraToken {
    type: MarkdownElement.ListItem;
    content: string;
    isOrdered: boolean;
}

interface HeadingToken extends ExtraToken {
    type: MarkdownElement.Heading;
    content: string;
    level: TitleLevel;
}

export type Token = ParagraphToken | ListItemToken | HeadingToken;