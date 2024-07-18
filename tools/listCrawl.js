require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");

const API = process.env.API_URL;

const scraperSchema = yup.object({
  urlList: yup.array().of(yup.string()).required(),
});

const scraperJSONSchema = yupToJsonSchema(scraperSchema);

const SCRAPER = {
  name: "targeted_links_crawler",
  description:
    "Scrapes all the pages using the links in the white list as base url.",
  category: "crawling",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: scraperJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async ({ urlList }, memory) => {
    try {
      const config = {
        type: "crawl",
        whiteList: urlList,
      };
      const response = await axios.post(
        API + "/scrape?url=" + urlList[0],
        config
      );
      for (const { url, title, content } of response.data) {
        memory[url] = { title, content };
      }
      return {
        responseString: "Scraping completed successfully",
        memory: memory,
      };
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

module.exports = SCRAPER;
