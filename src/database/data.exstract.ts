import { convertCSVToArray } from "convert-csv-to-array";
import fs from "fs";

export function extractFromCsv(filePath: string) {
    let data = fs.readFileSync(filePath, { encoding: "utf8" });
    data = data.replace(/\r/g, "");
    return convertCSVToArray(data, {
        separator: ",",
        header: false,
    });
}