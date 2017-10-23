//

import * as path from "path";
import { createPollyContent } from "./create-polly-content/create-polly-content";
import { createArticleData } from "./create-article-data/create-article-data";
import { writePollyIndex } from "./write-polly-index/write-polly-index";
import { convertMp3 } from "./convert-mp3-via-polly/mp3";
import { concatAudios } from "./concat-audio/concat-mp3";

const option = {
    // dry-run : not api connect
    dryRun: true
};
const filePath = path.join(
    __dirname,
    "../test/create-polly-content/fixtures/2017-10-10-mocha-4.0.0-npm-2-whatwg-stream.md"
);
const pollyContentList = createPollyContent(createArticleData(filePath));
const directory = path.resolve(path.join(__dirname, "../weeks/" + pollyContentList.weekNumber + "/"));
const allOutputDir = path.resolve(path.join(__dirname, "../docs/" + pollyContentList.weekNumber + "/"));
writePollyIndex(pollyContentList, directory);
if (!option.dryRun) {
    convertMp3(directory)
        .then(() => {
            console.log("Convert Success");
            return concatAudios(directory, path.join(allOutputDir, "jser.mp3"));
        })
        .catch(error => {
            console.error(error);
        });
} else {
    console.log("Dry-run: convertMp3");
}
