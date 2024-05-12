// conversion utilities for files

import fs from "fs";
import path from "path";
import {
  dateFromGen1Filename,
  getDataFileNameForDate,
  isGen1File,
} from "./filenames";

async function convertGen1Gen2(sourceDir: string, destDir: string) {
  // Gen 1 the filenames were just generated from Date.getLocalString(), and there
  // was no timestamp in the files.
  // Gen 2 had ISO based files, and a queryTimestamp field in the data

  let files = [];
  try {
    files = await fs.promises.readdir(sourceDir);
  } catch (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function (filename) {
    // skip any files not gen 1
    if (!isGen1File(filename)) return;

    let collectionDate: Date;
    try {
      collectionDate = dateFromGen1Filename(filename);
    } catch (err) {
      console.log(`exception caught parsing ${filename}: ${err}`);
      return;
    }

    // read the old file
    const fileWithPath = path.join(sourceDir, filename);
    const rawdata = fs.readFileSync(fileWithPath);

    // and append the timestamp to the new json data
    const jsonData = { collectionDate, ...JSON.parse(rawdata.toString()) };

    // write out to the new location
    const newFilename = getDataFileNameForDate(collectionDate);
    const newPath = path.join(destDir, newFilename);

    fs.writeFileSync(newPath, JSON.stringify(jsonData));

    console.log(`converted ${fileWithPath} -> ${newPath}`);
  });
}

convertGen1Gen2("remotes3", "converted");
