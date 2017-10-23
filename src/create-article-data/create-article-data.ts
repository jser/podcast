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
import { parse } from "jser-item-category-parser";
import * as path from "path";
import * as fs from "fs";

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
    return {
        weekNumber: jserWeek.weekNumber,
        url: jserWeek.post.url,
        title: jserWeek.post.title,
        items: parse(content)
    };
}
