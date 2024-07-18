require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");

const API = process.env.API_URL;

const scraperSchema = yup.object({
  url: yup.string().required(),
});

const scraperJSONSchema = yupToJsonSchema(scraperSchema);

const SCRAPER = {
  name: "scrape_single_page",
  description: "Scrapes a single page.",
  category: "scraping",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: scraperJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async ({ url }, memory) => {
    try {
      const config = {
        type: "link",
        whiteList: [url],
      };
      const response = await axios.post(API + "/scrape?url=" + url, config);
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
