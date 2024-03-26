export enum MarkdownElement {
    Heading = 'heading',
    ListItem = 'listItem',
    Paragraph = 'paragraph',
    Bold = 'bold',
    Italic = 'italic',
    InlineCode = 'inlineCode',
    Delete = 'delete',
    HorizontalRule = 'horizontalRule',
    Blockquote = 'blockquote',
    Link = 'link',
    Image = 'image',
    TaskList = 'taskList',
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
    // 分割线 暂时先只支持--- ^(-{3,}|*{3,}|_{3,})$
    horizontalRule: /^(-{3,})$/,
    // 引用 > xxx
    blockquote: /^>(?:\s.*)$/gm,
    // 链接文字
    link: /\[([^\]]*)\]\(([^)]*)\)/g,
    // 图片
    image: /!\[(.*?)\]\((.*?)\)/g,
    // 任务列表
    taskList: /^(-|\*) \[( |x)\] (.*)$/gm,
}