require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");

const API = process.env.API_URL;

const scraperSchema = yup.object({
  baseUrl: yup.string().required(),
});

const scraperJSONSchema = yupToJsonSchema(scraperSchema);

const SCRAPER = {
  name: "content_and_media_crawler",
  description:
    "Gets both the content and the image, audio, video and other media links from all pages starting from the base url.",
  category: "untitled",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: scraperJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async ({ baseUrl }, memory) => {
    try {
      const config = {
        type: "crawl",
      };
      const response = await axios.post(API + "/scrape?url=" + baseUrl, config);
      for (const { title, content } of response.data) {
        memory[title] = content;
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
