require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");
const API = process.env.API_URL;

const scraperSchema = yup.object({
  url: yup.string().required(),
  type: yup.string().required(),
  whiteList: yup.array().of(yup.string()),
  blackList: yup.array().of(yup.string()),
  content: yup.bool(),
  images: yup.bool(),
  videos: yup.bool(),
  audios: yup.bool(),
  links: yup.bool(),
});

const scraperJSONSchema = yupToJsonSchema(scraperSchema);

const SCRAPE_MEDIA_LIST_PAGES = {
  name: "guided_crawler",
  description:
    "Crawls all pages under a base url guided by scopes or regex patterns.",
  category: "media_scraping",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: scraperJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: true,
  runCmd: async (
    { url, type, whiteList, blackList, content, images, videos, audios, links },
    memory
  ) => {
    try {
      const config = {
        type: type,
        whiteList: whiteList,
        blackList: blackList,
        Content: content,
        Images: images,
        Videos: videos,
        Audios: audios,
        Links: links,
      };
      const response = await axios.post(API + "/scrape?url=" + url, config);
      for (const { url, title, content } of response.data) {
        memory[url] = { title: title, content: content };
      }
      return {
        responseString:
          "Scraping completed successfully. Data has been saved in the memory.",
        memory: memory,
      };
    } catch (err) {
      return "Error trying to execute the tool" + JSON.stringify(err);
    }
  },
};

module.exports = SCRAPE_MEDIA_LIST_PAGES;
