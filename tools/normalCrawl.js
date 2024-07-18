const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");

const scraperSchema = yup.object({
  baseUrl: yup.string().required(),
});

const scraperJSONSchema = yupToJsonSchema(scraperSchema);

const SCRAPER = {
  name: "url_crawler",
  description: "Scrapes all pages strating from a base url.",
  category: "crawling",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: scraperJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ baseUrl }, memory) => {
    try {
      const response = await axios.post(
        "http://localhost:6969/api/scrape?url=" + baseUrl
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
