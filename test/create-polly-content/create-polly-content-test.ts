// MIT © 2017 azu
import { createArticleData } from "../../src/create-article-data/create-article-data";
import { createPollyContent } from "../../src/create-polly-content/create-polly-content";
import * as path from "path";
import * as assert from "assert";

describe("create-article-data", () => {
    it("should return article data", () => {
        const filePath = path.join(__dirname, "fixtures/2017-10-10-mocha-4.0.0-npm-2-whatwg-stream.md");
        const pollyContentList = createPollyContent(createArticleData(filePath));
        assert.equal(pollyContentList.weekNumber, 352);
        assert.equal(pollyContentList.title, "2017-10-10のJS: Mocha 4.0.0、npm 2要素認証、WHATWG Stream");
        assert.equal(pollyContentList.url, "https://jser.info/2017/10/10/mocha-4.0.0-npm-2-whatwg-stream/");
        assert.equal(typeof pollyContentList.content, "string");
        assert.ok(Array.isArray(pollyContentList.items));
        const [titleItem, category1, item1] = pollyContentList.items;
        assert.deepStrictEqual(
            titleItem,
            {
                text: "2017年10月10日のJSer.info",
                ssml: '<speak>2017年10月10日の<sub alias="ジェイエスアーインフォ">JSer.info</sub><break time="2s"/></speak>',
                key: "title",
                fileName: "0.title",
                type: "decoration"
            },
            JSON.stringify(titleItem)
        );
        assert.deepStrictEqual(
            category1,
            {
                text: "次はヘッドラインのコーナーです。",
                ssml:
                    "<speak><break time='2000ms'/> <p>次は<emphasis level=\"moderate\">ヘッドライン</emphasis>のコーナーです。</p></speak>",
                key: "Headline",
                fileName: "1.Headline",
                type: "decoration"
            },
            JSON.stringify(category1)
        );
        assert.deepStrictEqual(item1, {
            fileName: "2",
            key: "2",
            text: "Mocha 4.0.0リリース。\nNode.js 0.1xなどのサポート終了、IE8/PhantomJS 1.xのサポート終了、`--no-exit`がデフォルトの動作になるなど",
            ssml:
                "<speak><emphasis level='moderate'>Release v4.0.0 · mochajs/mocha</emphasis> <break time='2000ms'/>\nMocha 4.0.0リリース。\nNode.js 0.1xなどのサポート終了、IE8/PhantomJS 1.xのサポート終了、--no-exitがデフォルトの動作になるなど\n</speak>",
            type: "item"
        });
    });
});
