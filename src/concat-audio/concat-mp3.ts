// MIT © 2017 azu
import * as path from "path";

import glob = require("glob");
import { PollyContentItem } from "../create-polly-content/create-polly-content";

const execFile = require("child_process").execFile;
const mp3cat = require("mp3cat-bin");
const makeDir = require("make-dir");

export function concatAudios(inputDirectory: string, outputPath: string) {
    const absoluteInputDir = path.resolve(process.cwd(), inputDirectory);
    const absoluteOutputPath = path.resolve(process.cwd(), outputPath);
    const absoluteOutputDir = path.dirname(absoluteOutputPath);
    makeDir.sync(absoluteOutputDir);
    const spaceNextAudio = path.resolve(path.join(__dirname, "../../resources/next-item.mp3"));
    const files = glob.sync(`${absoluteInputDir}/*.mp3`);
    // sort by number 1,2,3.....
    const collator = new Intl.Collator("ja", { numeric: true });
    const sortedFiles = files.sort(collator.compare).map(filePath => {
        return path.resolve(filePath);
    });
    const allMp3FilePathList: string[] = [];
    const getPollyContentItem = (filePath: string): PollyContentItem => {
        const dirname = path.dirname(filePath);
        const filename = path.basename(filePath, ".mp3");
        return require(path.resolve(path.join(dirname, `${filename}.json`)));
    };
    // add space to key: item
    sortedFiles.forEach((filePath, index) => {
        const currentItem = getPollyContentItem(filePath);
        const prevItem = index > 0 ? getPollyContentItem(sortedFiles[index - 1]) : undefined;
        // add space.mp3 before item
        if (currentItem.type === "item") {
            if (prevItem && prevItem.type !== "decoration") {
                allMp3FilePathList.push(spaceNextAudio);
            }
        }
        allMp3FilePathList.push(filePath);
    });
    return new Promise((resolve, reject) => {
        // concat
        execFile(
            mp3cat,
            allMp3FilePathList.concat(["--force", "--out", absoluteOutputPath]),
            (err: any, stdout: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(stdout);
            }
        );
    });
}
