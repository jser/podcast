// MIT © 2017 azu
const remarkAbstract = require("remark");
const remark = remarkAbstract();
const mdAstToString = require("mdast-util-to-string");
const visit = require("unist-util-visit-parents");
const Speech = require("ssml-builder");
const xmlescape = require("xml-escape");
const toString = (node: RemarkNode): string => {
    return xmlescape(mdAstToString(node));
};

export interface SSMLBuilder {
    pause(text: string): void;

    say(text: string): void;

    emphasis(type: string, text: string): void;

    paragraph(text: string): void;

    sayAs({ word, interpret }: { word: string; interpret: string }): void;

    ssml(noWrap: boolean): string;
}

export function SSML(handler: (speech: SSMLBuilder) => void) {
    const speech: SSMLBuilder = new Speech();
    handler(speech);
    return speech.ssml(true);
}

export interface RemarkNode {
    type: string;
    children?: RemarkNode[];
    value?: string;
}

export interface markdownToSSMLOptions {
    // mill second
    breakTimeAroundHeader: number; // 2000
    // mill second
    breakTimeAfterParagraph: number; // 1000
}

export function markdownToSSML(content: string, options: markdownToSSMLOptions): string {
    const AST = remark.parse(content);
    let text = "";
    visit(AST, "text", (node: RemarkNode, parents: RemarkNode[]) => {
        const result = visitor(node, parents, options);
        if (result) {
            text += result;
        }
    });
    return text;
}

export function visitor(node: RemarkNode, parents: RemarkNode[], options: markdownToSSMLOptions) {
    const parentNodeType = parents[parents.length - 1].type;
    const process = (visitorNodes as any)[parentNodeType] as Processor;
    if (process === undefined) {
        throw new Error(`No support ${node.type}`);
    }
    return process(node, options);
}

export type Processor = (node: RemarkNode, options?: markdownToSSMLOptions) => string;
export const visitorNodes = {
    root: () => "",
    text: toString,
    heading: (node: RemarkNode, options: markdownToSSMLOptions) => {
        return SSML(speech => {
            speech.pause(`${options.breakTimeAroundHeader}ms`);
            speech.say(toString(node));
            speech.pause(`${options.breakTimeAroundHeader}ms`);
        });
    },
    // plain
    paragraph: (node: RemarkNode, _options: markdownToSSMLOptions) => {
        return toString(node);
    },
    blockquote: (node: RemarkNode, _options: markdownToSSMLOptions) => {
        return SSML(speech => {
            // http://waic.jp/docs/as/info/201209/H049-2.html
            speech.pause("ここから引用");
            speech.pause("1s");
            speech.say(toString(node));
            speech.pause("1s");
            speech.pause("引用終了");
        });
    },
    list: toString,
    listItem: toString,
    inlineCode: (node: RemarkNode, _options: markdownToSSMLOptions) => {
        return SSML(speech => {
            speech.sayAs({ word: toString(node), interpret: "characters" });
        });
    },
    code: (node: RemarkNode, _options: markdownToSSMLOptions) => {
        return SSML(speech => {
            speech.pause("500ms");
            speech.sayAs({ word: toString(node), interpret: "characters" });
            speech.pause("500ms");
        });
    },
    html: toString,
    thematicBreak: () => "",
    strong: (node: RemarkNode, _options: markdownToSSMLOptions) => {
        return SSML(speech => {
            speech.emphasis("moderate", toString(node));
        });
    },
    emphasis: (node: RemarkNode, _options: markdownToSSMLOptions) => {
        return SSML(speech => {
            speech.emphasis("moderate", toString(node));
        });
    },
    break: (_node: RemarkNode, _options: markdownToSSMLOptions) => {
        return SSML(speech => {
            speech.pause("100ms");
        });
    },
    delete: () => "",
    link: (node: RemarkNode, _options: markdownToSSMLOptions) => {
        return SSML(speech => {
            speech.emphasis("reduced", toString(node));
        });
    },
    linkReference: toString,
    imageReference: toString,
    definition: toString,
    image: (node: RemarkNode, _options: markdownToSSMLOptions) => {
        return SSML(speech => {
            speech.say("画像");
            speech.pause("100ms");
            speech.say(toString(node));
        });
    },
    footnote: () => "",
    footnoteReference: () => "",
    footnoteDefinition: () => "",
    table: () => "",
    tableCell: () => ""
};
