import { S3Client } from "@aws-sdk/client-s3";
const s3Client = new S3Client({ region: "us-east-1" });

// no types for this guy, so gotta roll this way
// eslint-disable-next-line @typescript-eslint/no-var-requires
const S3SyncClient = require("s3-sync-client");
const { sync } = new S3SyncClient({ client: s3Client });

// same same
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TransferMonitor } = require("s3-sync-client");

export async function syncAllFromS3(): Promise<void> {
  console.log("about to sync");

  const monitor = new TransferMonitor();
  //monitor.on("progress", (progress: any) => console.log(progress));
  setTimeout(() => monitor.abort(), 3000); // optional abort

  await sync("s3://wait-time-probe-bucket-dev", "./remotes3", {
    monitor,
    //partSize: 100 * 1024 * 1024,
    //dryRun: true,
    // commandInput: {
    //   ACL: "aws-exec-read",
    // },
  });

  console.log("done sync!");
}

syncAllFromS3();
