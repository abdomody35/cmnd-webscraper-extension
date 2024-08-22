require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");
const API = process.env.API_URL;

const crawlerSchema = yup.object({
  baseUrl: yup.string().required(),
  whiteList: yup.array().of(yup.string()),
  blackList: yup.array().of(yup.string()),
});

const crawlerJSONSchema = yupToJsonSchema(crawlerSchema);

const CRAWL_MEDIA_REGEX_PATTERNS = {
  name: "crawl_using_regex_media",
  description:
    "Crawls media using regex patterns with whitelist and blacklist.",
  category: "media_crawling",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: crawlerJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: true,
  runCmd: async ({ baseUrl, whiteList, blackList }, memory) => {
    try {
      const config = {
        type: "regex",
        whiteList: whiteList,
        blackList: blackList || [],
        extractMedia: true,
        extractContent: false,
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

module.exports = CRAWL_MEDIA_REGEX_PATTERNS;
