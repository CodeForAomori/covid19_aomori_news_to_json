const fs = require("fs");
import { dirs, item } from "./types";
import { buildJsonPath } from "./utils";
/**
 * This is an optional script. It creates a JSON file that's following format of the following file:
 * https://github.com/tokyo-metropolitan-gov/covid19/blob/master/data/data.json
 *
 * Reference:
 * - https://docs.google.com/spreadsheets/d/1PWwV2bn9N9C2Cfox9-KdXDryIkRPh6LEpbXVZsAfwwM/edit#gid=0
 * - https://docs.google.com/spreadsheets/d/1SzMw0_Kg4MJJmgafq0NUeYEKdxAiyvPT_wWxWl-zrNw/edit#gid=0
 */

async function mapper(item: item, dirs: dirs): Promise<void> {
  
  const newsJson = JSON.parse(item.data);

  const values = newsJson.values
    .slice(1)
    .filter((v:any) => 0 < v[1].indexOf("コロナ"));

  const mappedJson = {
    newsItems: values.map((row:any) => {
      return {
        date: row[0],
        text: row[1],
        url: row[2],
      };
    }),
  };

  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(
        buildJsonPath("news.json", dirs.dist || ""),
        JSON.stringify(mappedJson, null, 2)
      );
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

export { mapper };
