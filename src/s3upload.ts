import {
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getDataFileNameForDate } from "./filenames";

export async function writeToS3(obj: Record<string, unknown>): Promise<void> {
  const s3Client = new S3Client({ region: "us-east-1" });
  const buf = Buffer.from(JSON.stringify(obj));

  console.log(`about to write: ${buf}`);

  const bucketName = process.env.JSON_S3_BUCKET;
  if (!bucketName) {
    console.log(`bucket is not defined! cannot write.`);
    throw `no bucket is defined`;
  }

  const collectionDate = (obj.collectionDate as Date) ?? new Date();
  const fileName = getDataFileNameForDate(collectionDate);

  console.log(`about to write to ${bucketName} at fileName: ${fileName}`);

  const bucketParams: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: fileName,
    Body: buf,
    ContentType: "application/json",
    // default ACL is just bucket owner
  };

  try {
    const data: PutObjectCommandOutput = await s3Client.send(
      new PutObjectCommand(bucketParams)
    );
    console.log(
      "Successfully uploaded object: " +
        bucketParams.Bucket +
        "/" +
        bucketParams.Key +
        " SHA256: " +
        data.ChecksumSHA256
    );
  } catch (err) {
    console.log("Error uploading to S3: ", err);
    throw err;
  }
}
