require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");
const API = process.env.API_URL;

const crawlerSchema = yup.object({
  urlList: yup.array().of(yup.string()).required(),
});

const crawlerJSONSchema = yupToJsonSchema(crawlerSchema);

const CRAWL_CONTENT_MEDIA_LIST_PAGES = {
  name: "crawl_list_content_media",
  description: "Crawls content and media from a list of pages.",
  category: "crawling",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: crawlerJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: true,
  runCmd: async ({ urlList }, memory) => {
    try {
      const config = {
        type: "crawl",
        whiteList: urlList,
        extractMedia: true,
      };
      const response = await axios.post(
        API + "/scrape?url=" + urlList[0],
        config
      );
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

module.exports = CRAWL_CONTENT_MEDIA_LIST_PAGES;
