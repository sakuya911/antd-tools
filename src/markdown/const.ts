export enum MarkdownElement {
    Heading = 'heading',
    ListItem = 'listItem',
    Paragraph = 'paragraph',
    Bold = 'bold',
    Italic = 'italic',
    InlineCode = 'inlineCode',
    Delete = 'delete',
}

/** 将markdown的正则全部写到一起 */
export const markdownRegex = {
    heading: /^\s*#{1,6}\s+/,
    bold: /\*\*(.*?)\*\*|__(.*?)__/g,
    unorderedList: /^\s*[-+*]\s+/,
    orderedList: /^\s*\d+\.\s+/,
    italic: /\*(.*?)\*|_(.*?)_/g,
    delete: /~~(.*?)~~/g,
    inlineCode: /`(.*?)`/g,
}