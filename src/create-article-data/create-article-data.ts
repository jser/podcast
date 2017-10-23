// MIT © 2017 azu
/**
 * Markdown記事から
 *
 * - URL
 * - タイトル
 * - 号数
 * - 各記事
 *
 * をまとめたデータを作って返す
 */
import { JSerStat, DefaultData } from "jser-stat";
import { parse, ParseResult } from "jser-item-category-parser";
import * as path from "path";
import * as fs from "fs";

export interface PodcastArticle {
    weekNumber: number;
    title: string;
    date: Date;
    url: string;
    content: string;
    items: ParseResult[];
}

export function createArticleData(filePath: string) {
    const fileName = path.basename(filePath, ".md");
    const fileNamePattern = /(\d{4})-(\d{2})-(\d{2})-(.*)/;
    const match = fileName.match(fileNamePattern);
    if (!match) {
        throw new Error("should jekyll article file path");
    }
    const [, year, month, day, slug] = match;
    // https://jser.info/2017/10/17/vue-2.5.0-e2e-glimmerbinary-template/
    const articleURL = `https://jser.info/${year}/${month}/${day}/${slug}/`;
    const jSerStat = new JSerStat(DefaultData.items, DefaultData.posts);
    const jserWeek = jSerStat.findJSerWeekWithURL(articleURL);
    if (!jserWeek) {
        throw new Error("not found article");
    }
    const content = fs.readFileSync(filePath, "utf-8");
    const items: ParseResult[] = parse(content);
    return {
        weekNumber: jserWeek.weekNumber,
        title: jserWeek.post.title,
        date: jserWeek.post.date,
        url: jserWeek.post.url,
        content,
        items: items
    };
}
