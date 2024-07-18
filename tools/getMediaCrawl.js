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
  name: "media_crawler",
  description:
    "Gets all image, audio, video and other media links all pages starting from the base url.",
  category: "media",
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
        type: "regex",
      };
      const response = await axios.post(API + "/scrape?url=" + url, config);
      for (const { title, content } of response.data) {
        if (title.endsWith(" - media")) memory[title] = content;
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
