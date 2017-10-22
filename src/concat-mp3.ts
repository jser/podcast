// MIT © 2017 azu
import * as path from "path";

import glob = require("glob");

const execFile = require("child_process").execFile;
const mp3cat = require("mp3cat-bin");

const spaceNextAudio = path.resolve(path.join(__dirname, "../next-item.mp3"));
const files = glob.sync("../output/*.mp3");

// sort: 1,2,3.....
const collator = new Intl.Collator("ja", { numeric: true });
const sortedFiles = files.sort(collator.compare).map(filePath => {
    return path.resolve(filePath);
});
// concat
execFile(
    mp3cat,
    sortedFiles.concat(["--interlace", spaceNextAudio, "--out", path.join(__dirname, "../all.mp3")]),
    (err: any, stdout: any) => {
        if (err) {
            return console.error(err);
        }
        console.log(stdout);
    }
);
