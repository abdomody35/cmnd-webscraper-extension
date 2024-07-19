require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");
const API = process.env.API_URL;

const crawlerSchema = yup.object({
  baseUrl: yup.string().required(),
});

const crawlerJSONSchema = yupToJsonSchema(crawlerSchema);

const CRAWL_CONTENT_MEDIA_BASE_URL = {
  name: "crawl_base_url_content_media",
  description: "Crawls content and media starting from the base url.",
  category: "crawling",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: crawlerJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async ({ baseUrl }, memory) => {
    try {
      const config = {
        type: "crawl",
        extractMedia: true,
      };
      const response = await axios.post(API + "/scrape?url=" + baseUrl, config);
      for (const { url, title, content } of response.data) {
        memory[url] = { title: title, content: content };
      }
      return {
        responseString:
          "Crawling completed successfully. Data has been saved in the memory.",
        memory: memory,
      };
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

module.exports = CRAWL_CONTENT_MEDIA_BASE_URL;
