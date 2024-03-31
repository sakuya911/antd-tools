export const ParseNodeRoot = 'root';

export enum MarkdownElement {
    Heading = 'heading',
    OrderedList = 'orderedList',
    UnorderedList = 'unorderedList',
    ListItem = 'listItem',
    Paragraph = 'paragraph',
    Text = 'text',
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
    /** 加粗 */
    bold: /\*\*(.*?)\*\*|__(.*?)__/g,
    /** 无序列表 */
    unorderedList: /^\s*[-+*]\s+/,
    /** 有序列表 */
    orderedList: /^\s*\d+\.\s+/,
    /** 斜体 */
    italic: /\*(.*?)\*|_(.*?)_/g,
    /** 删除线 */
    delete: /~~(.*?)~~/g,
    /** 行内代码 */
    inlineCode: /`(.*?)`/g,
    // 分割线 暂时先只支持--- ^(-{3,}|*{3,}|_{3,})$
    horizontalRule: /^(-{3,})$/,
    // 引用 > xxx
    blockquote: /^>\s*.*$/,
    // 链接文字
    link: /\[([^\]]*)\]\(([^)]*)\)/g,
    // 图片
    image: /!\[(.*?)\]\((.*?)\)/g,
    // 任务列表
    taskList: /^(-|\*) \[( |x)\] (.*)$/,
}