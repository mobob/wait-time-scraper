export function isWaitTimeDataFile(filename: string): boolean {
  return filename.startsWith("wtd2_");
}

// this is for "current" version
export function getDataFileNameForDate(date: Date): string {
  // the "2" stands for generation 2 :)
  const fileName = `wtd2_${date.toISOString()}.json`.replace(/[ ,/:]/g, "_");
  return fileName;
}

console.log(getDataFileNameForDate(new Date()));

export function isGen1File(filename: string): boolean {
  return filename.startsWith("wtd_");
}

export function dateFromGen1Filename(filename: string): Date {
  // sample - note, this is in "local" time:
  // wtd_11_12_2022__6_32_03_PM.json

  // ...  so lets get the timezone offset and add that on too
  const offset = new Date().getTimezoneOffset();

  // prune off the beginning and end and get date and time vals
  const [month, day, year, hour, min, sec, ampm] = filename
    .replace("__", "_") // just in case there are doubles
    .replace("wtd_", "")
    .replace(".json", "")
    .split("_");

  const date = new Date(
    +year,
    +month - 1,
    +day,
    +hour + (ampm == "PM" ? 12 : 0), // yes this does seem to roll over properly
    +min - offset,
    +sec
  );

  return date;
}
