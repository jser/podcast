// MIT © 2017 azu

import { PodcastArticle } from "../create-article-data/create-article-data";
import { convertItemToSSML } from "./JSerItemToSpeech";
import { Category } from "jser-item-category-parser";
import moment = require("moment");
import groupBy = require("lodash.groupBy");

export interface PollyContentItem {
    text: string; // raw text
    ssml: string; // SSML tag
    // decoration は装飾的なもの
    // item は紹介した記事
    type: "decoration" | "item";
    key: string; //  key for cache
    fileName: string; // placeholder or exist path
}

export interface PollyContentList {
    weekNumber: number;
    title: string;
    url: string;
    content: string;
    items: PollyContentItem[];
}

export const getCategoryName = (categoryKey: keyof typeof Category): string => {
    return Category[categoryKey];
};

export function createPollyContent(article: PodcastArticle): PollyContentList {
    const dateString = moment(article.date).format("YYYY年MM月DD日");
    const titleCallText = `
<speak>${dateString}の<sub alias="ジェイエスアーインフォ">JSer.info</sub><break time="2s"/></speak>
`.trim();
    const opening: PollyContentItem = {
        text: `${dateString}のJSer.info`,
        ssml: titleCallText,
        key: "title",
        fileName: "0.title",
        type: "decoration"
    };

    const items: PollyContentItem[] = [opening];
    const itemsByCategory = groupBy(article.items, "category");
    Object.keys(itemsByCategory).forEach((categoryKey: keyof typeof Category) => {
        const cateryName = getCategoryName(categoryKey);
        items.push({
            text: `次は${cateryName}のコーナーです。`,
            ssml: `<speak><break time='2000ms'/> <p>次は<emphasis level="moderate">${cateryName}</emphasis>のコーナーです。</p></speak>`,
            key: categoryKey,
            fileName: `${items.length}.${categoryKey}`,
            type: "decoration"
        });
        const categoryItems = itemsByCategory[categoryKey];
        categoryItems.forEach(item => {
            items.push({
                text: item.content,
                ssml: convertItemToSSML(item),
                key: String(items.length),
                fileName: `${items.length}`,
                type: "item"
            });
        });
    });
    items.push({
        text: `${article.weekNumber}回目のJSer.infoは以上です。詳しくは https://jser.info/ を見てください。`,
        ssml: `<speak><break time="2s"/>${article.weekNumber}回目の<sub alias="ジェイエスアーインフォ">JSer.info</sub>は以上です。詳しくは https://jser.info/ を見てください。</speak>`,
        key: "ending",
        fileName: `${items.length}.ending`,
        type: "decoration"
    });
    return {
        weekNumber: article.weekNumber,
        title: article.title,
        url: article.url,
        content: article.content,
        items: items
    };
}
