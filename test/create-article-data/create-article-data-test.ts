// MIT © 2017 azu
import { createArticleData } from "../../src/create-article-data/create-article-data";
import * as path from "path";
import * as assert from "assert";

describe("create-article-data", () => {
    it("should return article data", () => {
        const data = createArticleData(path.join(__dirname, "fixtures/2017-10-10-mocha-4.0.0-npm-2-whatwg-stream.md"));
        assert.equal(data.weekNumber, 352);
        assert.equal(data.title, "2017-10-10のJS: Mocha 4.0.0、npm 2要素認証、WHATWG Stream");
        assert.equal(data.url, "https://jser.info/2017/10/10/mocha-4.0.0-npm-2-whatwg-stream/");
        assert.equal(typeof data.content, "string");
        assert.ok(Array.isArray(data.items));
        const [item] = data.items;
        assert.deepEqual(
            item,
            {
                category: "Headline",
                title: "Release v4.0.0 · mochajs/mocha",
                url: "https://github.com/mochajs/mocha/releases/tag/v4.0.0",
                tags: ["JavaScript", "testing", "ReleaseNote"],
                content: "Mocha 4.0.0リリース。\nNode.js 0.1xなどのサポート終了、IE8/PhantomJS 1.xのサポート終了、`--no-exit`がデフォルトの動作になるなど",
                relatedLinks: [
                    {
                        title: "Mocha v4 Nears Release",
                        url: "https://boneskull.com/mocha-v4-nears-release/"
                    },
                    {
                        title: "compilers deprecation · mochajs/mocha Wiki",
                        url: "https://github.com/mochajs/mocha/wiki/compilers-deprecation"
                    }
                ]
            },
            JSON.stringify(item)
        );
    });
});
