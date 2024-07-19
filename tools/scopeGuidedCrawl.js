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

const CRAWL_USING_SCOPES = {
  name: "crawl_using_scopes",
  description: "Crawls using scopes with whitelist and blacklist.",
  category: "crawling",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: crawlerJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async ({ baseUrl, whiteList, blackList }, memory) => {
    try {
      const config = {
        type: "scope",
        whiteList: whiteList,
        blackList: blackList || [],
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

module.exports = CRAWL_USING_SCOPES;
