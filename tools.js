const CRAWLER = require("./tools/normalCrawl");
const SCRAPER = require("./tools/singlePage");
const WHITE_LIST_SCRAPER = require("./tools/targetedLinks");
const SCOPED_CRAWLER = require("./tools/scopedCrawl");
const REGEX_CRAWLER = require("./tools/regexGuidedCrawl");
const WHITE_LIST_CRAWLER = require("./tools/listCrawl");
const MEDIA_SCRAPER = require("./tools/getMedia");
const MEDIA_CRAWLER = require("./tools/getMediaCrawl");

const tools = [
  SCRAPER,
  CRAWLER,
  WHITE_LIST_SCRAPER,
  SCOPED_CRAWLER,
  REGEX_CRAWLER,
  WHITE_LIST_CRAWLER,
  MEDIA_SCRAPER,
  MEDIA_CRAWLER,
];
module.exports = tools;
