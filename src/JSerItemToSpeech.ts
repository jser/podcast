// MIT © 2017 azu
import { markdownToSSML, SSML } from "./markdown-to-ssml";

export interface JSerItem {
    category: string;
    title: string;
    url: string;
    tags: string[];
    content: string;
    relatedLinks: { title: string; url: string }[];
}

export function convertToSpeech(item: JSerItem): string {
    const title = SSML(speech => {
        speech.emphasis("moderate", item.title);
        speech.pause(`2000ms`);
    });
    const content = markdownToSSML(item.content, {
        breakTimeAroundHeader: 2000,
        breakTimeAfterParagraph: 1000
    });
    return `<speak>
${title}
${content}
</speak>`;
}
