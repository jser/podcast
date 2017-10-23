// MIT © 2017 azu
import * as fs from "fs";
import * as path from "path";
import { PollyContentList } from "../create-polly-content/create-polly-content";

const makeDir = require("make-dir");

export function writePollyIndex(list: PollyContentList, directory: string) {
    const output = path.resolve(process.cwd(), directory);
    makeDir.sync(output);
    list.items.forEach(item => {
        fs.writeFileSync(path.join(output, `${item.fileName}.json`), JSON.stringify(item, null, 4), "utf-8");
    });
}
