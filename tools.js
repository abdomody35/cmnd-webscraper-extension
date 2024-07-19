const listCrawl = require("./tools/listCrawl");
const listCrawlBoth = require("./tools/listCrawlBoth");
const listCrawlMedia = require("./tools/listCrawlMedia");
const listScrape = require("./tools/listScrape");
const listScrapeBoth = require("./tools/listScrapeBoth");
const listScrapeMedia = require("./tools/listScrapeMedia");
const regexGuidedCrawl = require("./tools/regexGuidedCrawl");
const regexGuidedCrawlBoth = require("./tools/regexGuidedCrawlBoth");
const regexGuidedCrawlMedia = require("./tools/regexGuidedCrawlMedia");
const scopeGuidedCrawl = require("./tools/scopeGuidedCrawl");
const scopeGuidedCrawlBoth = require("./tools/scopeGuidedCrawlBoth");
const scopeGuidedCrawlMedia = require("./tools/scopeGuidedCrawlMedia");
const singlePageCrawl = require("./tools/singlePageCrawl");
const singlePageCrawlBoth = require("./tools/singlePageCrawlBoth");
const singlePageCrawlMedia = require("./tools/singlePageCrawlMedia");
const singlePageScrape = require("./tools/singlePageScrape");
const singlePageScrapeBoth = require("./tools/singlePageScrapeBoth");
const singlePageScrapeMedia = require("./tools/singlePageScrapeMedia");

const tools = [
  listCrawl,
  listCrawlMedia,
  listCrawlBoth,
  listScrape,
  listScrapeMedia,
  listScrapeBoth,
  regexGuidedCrawl,
  regexGuidedCrawlMedia,
  regexGuidedCrawlBoth,
  scopeGuidedCrawl,
  scopeGuidedCrawlMedia,
  scopeGuidedCrawlBoth,
  singlePageCrawl,
  singlePageCrawlMedia,
  singlePageCrawlBoth,
  singlePageScrape,
  singlePageScrapeMedia,
  singlePageScrapeBoth,
];
module.exports = tools;
