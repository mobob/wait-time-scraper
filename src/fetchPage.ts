import axios, { AxiosError } from "axios";

export function fetchPage(url: string): Promise<string | undefined> {
  const HTMLData = axios
    .get(url)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      console.error(`There was an error: ${error}`);
      console.error(`There was an error with ${error?.config?.url}.`);
      console.error(error?.toJSON());
    });

  return HTMLData;
}

export async function fetchJSON(url: string): Promise<any | undefined> {
  const json = await axios
    .get(url)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      console.error(`There was an error: ${error}`);
      console.error(`There was an error with ${error?.config?.url}.`);
      console.error(error?.toJSON());
    });

  //console.log(`raw json result: ${JSON.stringify(json)}`);

  return json;
}
