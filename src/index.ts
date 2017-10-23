//

import * as path from "path";
import { createPollyContent } from "./create-polly-content/create-polly-content";
import { createArticleData } from "./create-article-data/create-article-data";
import { writePollyIndex } from "./write-polly-index/write-polly-index";
import { convertMp3 } from "./convert-mp3-via-polly/mp3";
import { concatAudios } from "./concat-audio/concat-mp3";

const filePath = path.join(
    __dirname,
    "../test/create-polly-content/fixtures/2017-10-10-mocha-4.0.0-npm-2-whatwg-stream.md"
);
const pollyContentList = createPollyContent(createArticleData(filePath));
const directory = path.resolve(path.join(__dirname, "../tmp/"));
writePollyIndex(pollyContentList, directory);
convertMp3(directory)
    .then(() => {
        console.log("Convert Success");
        return concatAudios(directory, path.join(__dirname, "../all.mp3"));
    })
    .catch(error => {
        console.error(error);
    });
