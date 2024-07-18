const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");

const scraperSchema = yup.object({
  baseUrl: yup.string().required(),
  whiteList: yup.array().of(yup.string()).required(),
  blackList: yup.array().of(yup.string()).required(),
});

const scraperJSONSchema = yupToJsonSchema(scraperSchema);

const SCRAPER = {
  name: "scoped_crawler",
  description:
    "Scrapes all pages strating from a base url based on a white and/or black list of scopes to follow.",
  category: "web crawling",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: scraperJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ baseUrl, whiteList, blackList }, memory) => {
    try {
      const config = {
        type: "scope",
        whiteList: whiteList,
        blackList: blackList,
      };
      const response = await axios.post(
        "http://localhost:6969/api/scrape?url=" + baseUrl,
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
