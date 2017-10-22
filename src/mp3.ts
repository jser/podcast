// MIT © 2017 azu

import { convertToPolly } from "./ConvertAmazonPolly";
import * as fs from "fs";
import glob = require("glob");
import * as path from "path";

const files = glob.sync("../output/*.ssml");

const promises = files.map(filePath => {
    const dirname = path.dirname(filePath);
    const filename = path.basename(filePath, ".ssml");
    const outputFilePath = path.resolve(path.join(dirname, `${filename}.mp3`));
    if (fs.existsSync(outputFilePath)) {
        return Promise.resolve();
    }
    const text = fs.readFileSync(filePath, "utf-8");
    return convertToPolly(text)
        .then(data => {
            if (data.AudioStream instanceof Buffer) {
                fs.writeFileSync(outputFilePath, data.AudioStream);
            }
        })
        .catch(error => {
            console.error(error);
        });
});
Promise.all(promises)
    .then(() => {
        console.log("COMPLETE");
    })
    .catch(error => {
        console.error(error);
    });
