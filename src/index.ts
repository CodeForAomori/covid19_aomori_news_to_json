const fs = require("fs");
const path = require("path");
const commander = require("commander");
import { item } from "./lib/types";
// import { openLocalFiles } from "./lib/openLocalFiles";
import { downloadFiles } from "./lib/downloadFiles";
// import { converter } from "./lib/converter";
// import { convertOpts } from "./lib/convertOpts";
import { mapper } from "./lib/mapper";
import { formatToMMDD, MMDDToDate } from "./lib/utils";
// import { CONST_KENSA, CONST_SOUDAN } from "./lib/const";

commander
  .description(
    "青森県の新着情報からコロナウイルスに関する記事へのリンクを抽出してnews.jsonを出力します。"
  )
  .parse(process.argv);

if (commander.help) {
  commander.outputHelp();
}

const RAW_JSON_DIR = path.join(__dirname, ".raw");
const JSON_DIR = path.join(__dirname, ".json");
// const OFFLINE_MODE = commander.offline || false;

// We don't know what date will be in the file name at what time. So let's queue multiple different dates.
// One of them should fail (gracefully) unless they forget removing it.
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
const today = new Date();
const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
const dates: Date[] =
  commander.date && /\d{4}/.test(commander.date)
    ? [MMDDToDate(commander.date)]
    : [yesterday, today, tomorrow];

console.log("STARTED");
mkDirs();

getJson()
  .then(async (items: item[]) => {
    await mapper(items[0], { dist: JSON_DIR });
    console.log(
      `DONE for dates: ${dates.map(date => formatToMMDD(date)).join(", ")}!`
    );
  })
  .catch(err => console.error(err));

function getJson(): Promise<item[]> {
  const fileNames = ["https://sheets.googleapis.com/v4/spreadsheets/1ubQxbbDzllQknTodIQP2gGSV2s8uYYhVGroeNMDnPks/values/%E9%9D%92%E6%A3%AE%E7%9C%8C!a1:d100?key=AIzaSyBOUrjga3gE7ZtGGZnyCKkGnuVC_eszf2M"];
  return downloadFiles(fileNames.flat(), RAW_JSON_DIR);
}

function mkDirs(): void {
  [RAW_JSON_DIR, JSON_DIR].forEach(dirName => {
    // Create directories we'd use.
    try {
      fs.mkdirSync(dirName);
    } catch (e) {}
  });
}
