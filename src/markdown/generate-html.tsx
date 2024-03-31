import type { ParseAST } from './parse';
import { MarkdownElement, ParseNodeRoot } from './const';
import { Typography, Divider, Alert, Image, Checkbox, Col, Row } from 'antd';

interface Props {
    node: ParseAST;
    keyValue?: number | string;
}

const { Title, Paragraph, Text, Link } = Typography;

/** 生成标题 */
function Heading({ node }: Props) {
    return <Title level={node.level}>{node.content}</Title>
}

/** 生成列表 */
function ListItem({ node }: Props) {
    const child = node.children?.map((item, index) => {
        return <li key={index}><ParagraphContent keyValue={index + 'key'} node={item} /></li>
    });
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

/** 任务列表 */
function TaskList({ node }: Props) {
    const child = node.children?.map((item, index) => (
        <Col key={index} span={24}>
            <Checkbox value={node.content} disabled={item.checked} checked={item.checked}>
                <ParagraphContent keyValue={index + 'key'} node={item} />
            </Checkbox>
        </Col>
    ));
    return <div className='mb-3'><Row>{child}</Row></div>
}

/** 引用段落显示 */
function Blockquote({ node }: Props) {
    const message = node.children?.map((item, index) => (
        <div key={index}>
            <ParagraphContent keyValue={index + 'key'} node={item} />
            { index === node.children!.length - 1 ? null : <br />}
        </div>
    ));
    return <Alert className='mb-3' key="1info" message={message} type="info" />
}

/** 生成段落 */
function ParagraphContent({ node, keyValue }: Props) {
    if (!node.content) {
        return null;
    }

    function getContent(item: ParseAST, index: number) {
        const content = item.content;

        if (!content) {
            return null;
        }
        if (item.type === MarkdownElement.Text) {
            return <span key={index}>{content}</span>
        }

        if (item.type === MarkdownElement.Link) {
            return (
                <Link
                    key={index}
                    href={item.href}
                    title={item.title}
                    target='_blank'>
                    {content}
                </Link>
            )
        }

        return <Text
                key={index}
                strong={item.type === MarkdownElement.Bold}
                italic={item.type === MarkdownElement.Italic}
                code={item.type === MarkdownElement.InlineCode}
                delete={item.type === MarkdownElement.Delete}>
                    {content}
                </Text>
    }
    return (
        <>
            {
                node.children!.length > 0
                    ? node.children!.map(getContent)
                    : <span key={keyValue}>{node.content}</span>
            }
        </>
    );
}

export default function GenerateHtml({ node }: Props) {
    if (node.type === ParseNodeRoot) {
        return (
            <>
                {node.children?.map((child, index) => <GenerateHtml key={index} node={child} />)}
            </>
        );
    }

    switch (node.type) {
        case MarkdownElement.Heading:
            return <Heading node={node} />;
        case MarkdownElement.OrderedList:
        case MarkdownElement.UnorderedList:
            return <Paragraph><ListItem node={node} /></Paragraph>;
        case MarkdownElement.TaskList:
            return <TaskList node={node}/>;
        case MarkdownElement.Paragraph:
            return <Paragraph><ParagraphContent node={node} /></Paragraph>;
        case MarkdownElement.HorizontalRule:
            return <Divider style={{ borderBlockStart: '1px solid rgba(5, 5, 5, 0.3)' }}/>
        case MarkdownElement.Blockquote:
            return <Blockquote node={node} />;
        case MarkdownElement.Image:
            return <div className='mb-3'>
                <Image src={node.content!} alt={node.title} width={'100%'} height={'100%'} />
            </div>;
        default:
            return null;
    }
}