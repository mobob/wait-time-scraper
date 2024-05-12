// import AWS from "aws-sdk";
// AWS.config.update({ region: "us-east-1" });

import fs from "fs";
import path from "path";

async function createCSV(csvFileName: string) {
  // for each file
  const dir = "./remotes3";

  //const allData: any[] = [];

  let files = [];
  try {
    files = await fs.promises.readdir(dir);
  } catch (err) {
    return console.log("Unable to scan directory: " + err);
  }

  let csvData = "";

  // add the headers
  csvData += "collectionDate,";
  csvData += "aveWaitMin,";
  csvData += "patientCount,";
  csvData += "longestWaitMin,";
  csvData += "lastUpdated";
  csvData += "\n";

  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    console.log(file);

    const fileWithPath = path.join(dir, file);

    const rawdata = fs.readFileSync(fileWithPath);
    const jsonData = JSON.parse(rawdata.toString());

    //console.log(jsonData);

    // add in the date to the data
    const collectionDate = new Date(jsonData.collectionDate);

    //allData.push({ timestamp: date, ...jsonData });

    csvData += collectionDate.toLocaleString().replace(",", "") + ",";
    csvData += jsonData.aveWaitMin + ",";
    csvData += jsonData.patientCount + ",";
    csvData += jsonData.longestWaitMin + ",";
    csvData += jsonData.lastUpdated + "\n";
  });

  //console.log("all data:");
  //console.log(allData);

  fs.writeFileSync(csvFileName, csvData);

  console.log(`wrote: ${csvFileName}, based on ${files.length} files.`);
}

async function writeCSV() {
  await createCSV("waittimedata.csv");
}
writeCSV();
