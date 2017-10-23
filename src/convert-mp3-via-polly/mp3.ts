// MIT © 2017 azu

//import { convertToPolly } from "./ConvertAmazonPolly";
import * as fs from "fs";
import glob = require("glob");
import * as path from "path";
import { PollyContentItem } from "../create-polly-content/create-polly-content";
import { convertToPolly } from "./ConvertAmazonPolly";

const debug = require("debug")("podcast");

export function convertMp3(directory: string) {
    const absoluteDir = path.resolve(process.cwd(), directory);
    const indexFiles = glob.sync(`${absoluteDir}/*.json`);

    const UPLOAD_LIMIT = 30;
    if (indexFiles.length > UPLOAD_LIMIT) {
        throw new Error(`Reach UPLOAD_LIMIT. バグしてるかも?: ${indexFiles.length} >= ${UPLOAD_LIMIT}`);
    }
    const promises = indexFiles.map(filePath => {
        const dirname = path.dirname(filePath);
        const filename = path.basename(filePath, ".json");
        const outputMp3FilePath = path.resolve(path.join(dirname, `${filename}.mp3`));
        if (fs.existsSync(outputMp3FilePath)) {
            debug(`Already exist mp3: ${outputMp3FilePath}`);
            return Promise.resolve();
        }
        console.log(`Processing: ${outputMp3FilePath}`);
        const item: PollyContentItem = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return convertToPolly(item.ssml).then(data => {
            if (data.AudioStream instanceof Buffer) {
                fs.writeFileSync(outputMp3FilePath, data.AudioStream);
            }
        });
    });
    return Promise.all(promises);
}
