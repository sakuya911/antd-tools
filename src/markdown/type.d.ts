import { MarkdownElement } from './const'

// 标题等级类型
export type TitleLevel =  1 | 2 | 3 | 4 | 5 | undefined;

interface NormalToken {
    type: Exclude<MarkdownElement, MarkdownElement.ListItem | MarkdownElement.Heading>
    content: string;
}

interface ListItemToken {
    type: MarkdownElement.ListItem;
    content: string;
    isOrdered: boolean;
}

interface HeadingToken {
    type: MarkdownElement.Heading;
    content: string;
    level: TitleLevel;
}

export type Token = NormalToken | ListItemToken | HeadingToken;