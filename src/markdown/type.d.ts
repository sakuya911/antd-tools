import { MarkdownElement } from './const'

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
    level: number
}

export type Token = NormalToken | ListItemToken | HeadingToken;