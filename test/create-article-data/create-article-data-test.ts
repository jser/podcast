// MIT © 2017 azu
import { createArticleData } from "../../src/create-article-data/create-article-data";
import * as path from "path";

describe("create-article-data", () => {
    it("should return article data", () => {
        const data = createArticleData(path.join(__dirname, "fixtures/2017-10-10-mocha-4.0.0-npm-2-whatwg-stream.md"));
        console.log(data);
    });
});
