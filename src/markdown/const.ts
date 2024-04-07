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


export const textDemo = `
# 标题

这是**一个**段落，**这是一个加粗字体**，这也是__加粗的方式__

- 无序列表项 1
- 无序列表项 2
- 无序列表项 3

---

这是第*二个*段落，*这是一个斜体*，这也是_斜体_的写法

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

---

这是第~~三个~~段落，~~这是一个删除线~~

这是第\`四个\`段落，\`const inlineCode = "这是一个行内代码";\`

> 段**落**1
> 段落2
> 段\`落\`3

这是第五个段落，内部有[链接文字，链接到百度](https://www.baidu.com "标题")，没想到吧！

[不带标题的链接文字，链接到百度](https://www.baidu.com)

这是第六个段落

![图片](https://p4.itc.cn/q_70/images03/20230512/32c7ad09b5904bea8506d74f96483000.png)

> 这是第二段引用

- [x] 任务列表1已完成
- [ ] 任务~~列表2~~
- [ ] 任务列表31**加粗**

这是第七个段落

`;