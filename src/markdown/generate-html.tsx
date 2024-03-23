import { ParserNodeType, type ParseAST } from './parse';
import { Typography } from 'antd';

interface Props {
    node: ParseAST
}

const { Title, Paragraph, Text } = Typography;

/** 生成标题 */
function Heading({ node }: Props) {
    return <Title level={node.level}>{node.content}</Title>
}

/** 生成列表 */
function ListItem({ node }: Props) {
    if (node.type !== ParserNodeType.ListItem) {
        const child = node.children?.map((item, index) => <ListItem key={index} node={item} />)
        return (
            <>
                {
                    node.ordered
                        ? <ol>{child}</ol>
                        : <ul>{child}</ul>
                }
            </>
        )
    }
    return <li>{node.content}</li>;
}

/** 生成段落 */
function ParagraphContent({ node }: Props) {
    if (!node.content) {
        return null;
    }

    function getContent(item: ParseAST, index: number) {
        const content = item.content;

        if (!content) {
            return null;
        }
        if (item.type === ParserNodeType.Text) {
            return <span key={index}>{content}</span>
        }

        return <Text
                key={index}
                strong={item.type === ParserNodeType.Bold}
                italic={item.type === ParserNodeType.Italic}
                code={item.type === ParserNodeType.InlineCode} >
                    {content}
                </Text>
    }
    return (
        <>
            {
                node.children!.length > 0
                    ? node.children!.map(getContent)
                    : node.content
            }
        </>
    );
}

export function GenerateHtml({ node }: Props) {
    if (node.type === ParserNodeType.Root) {
        return (
            <>
                {node.children?.map((child, index) => <GenerateHtml key={index} node={child} />)}
            </>
        );
    }

    switch (node.type) {
        case ParserNodeType.Heading:
            return <Heading node={node} />;
        case ParserNodeType.OrderedList:
        case ParserNodeType.UnorderedList:
            return <Paragraph><ListItem node={node} /></Paragraph>;
        case ParserNodeType.Paragraph:
            return <Paragraph><ParagraphContent node={node} /></Paragraph>;
        default:
            return null;
    }
}