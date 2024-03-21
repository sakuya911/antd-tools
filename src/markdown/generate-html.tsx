import React from 'react';
import { ParserNodeType, type ParseAST } from './parse';

interface Props {
    node: ParseAST
}

/** 生成标题 */
function Heading({ node }: Props) {
    return React.createElement(
        `h${node.level}`,
        null,
        node.content
    );
}

/** 生成列表 */
function ListItem({ node }: Props) {
    if (node.type !== ParserNodeType.ListItem) {
        const child = node.children?.map(item => <ListItem node={item} />)
        return (
            <>
                {
                    node.ordered
                        ? <ol>{ child }</ol>
                        : <ul>{ child }</ul>
                }
            </>
        )
    }
    return <li>{node.content}</li>;
}

/** 生成段落 */
function Paragraph({ node }: Props) {
    if (!node.content) {
        return <></>;
    }
    return (
        <>
            <div>{node.content}</div>
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
            return <ListItem node={node} />;
        case ParserNodeType.Paragraph:
            return <Paragraph node={node} />;
        default:
            return null;
    }
}