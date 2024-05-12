# Hospital Wait Time Scraper

A simple tool to query for, then store hospital wait times in S3. Currently hooked up to CHEO's wait times.

This is all pretty untidy and not-general purpose. If you have any questions or you're intersted in it please ask and I can clean it up to make it so.

# Usage

To get started, first download all new files:

```bash
npx ts-node ./src/syncFromS3.ts
```

This will dump all the files into `remotes3` directory. It might fail, if so re-run it!

Then generate a new CSV:

```bash
npx ts-node ./src/generateCSV.ts
```

Then, import this into google sheets!
