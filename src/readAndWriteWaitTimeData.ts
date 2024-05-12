import { fetchJSON } from "./fetchPage";
import { writeToS3 } from "./s3upload";

type CHEOWaitTimeInfo = {
  collectionDate: Date;
  aveWaitMin: number;
  patientCount: number;
  longestWaitMin: number;
  lastUpdated: Date;
};

async function getPatientsWaitingJSON() {
  // looks like this:
  // {"aveWaitMin":255.85,"patientCount":65,"longestWaitMin":518,"lastUpdated":"1/1/1970 3:05:27 PM"}
  const waitTimeInfo = (await fetchJSON(
    "https://www.cheo.on.ca/Common/Services/GetWaitTimes.ashx?&lang=en"
  )) as CHEOWaitTimeInfo;

  waitTimeInfo.collectionDate = new Date();

  console.log(`pulled waitTimeInfo at ${new Date().toLocaleString()}`);
  console.log(waitTimeInfo);
  return waitTimeInfo;
}

export async function readAndWriteWaitTimeData(event: any) {
  //module.exports.readAndWriteWaitTimeData = async (event: any) => {
  const waitTimeInfo = await getPatientsWaitingJSON();
  await writeToS3(waitTimeInfo);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Data written successfuly",
        input: event,
        waitTimeData: waitTimeInfo,
      },
      null,
      2
    ),
  };
}
