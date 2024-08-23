require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");
const API = process.env.API_URL;

const scraperSchema = yup.object({
  urlList: yup.array().of(yup.string()).required(),
  content: yup.bool(),
  images: yup.bool(),
  videos: yup.bool(),
  audios: yup.bool(),
  links: yup.bool(),
});

const scraperJSONSchema = yupToJsonSchema(scraperSchema);

const SCRAPE_MEDIA_LIST_PAGES = {
  name: "scraper",
  description: "Scrapes a number of pages.",
  category: "media_scraping",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: scraperJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: true,
  runCmd: async (
    { urlList, content, images, videos, audios, links },
    memory
  ) => {
    try {
      const config = {
        type: "link",
        whiteList: urlList,
        Content: content,
        Images: images,
        Videos: videos,
        Audios: audios,
        Links: links,
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
          "Scraping completed successfully. Data has been saved in the memory.",
        memory: memory,
      };
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

module.exports = SCRAPE_MEDIA_LIST_PAGES;
