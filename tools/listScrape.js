require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");
const API = process.env.API_URL;

const scraperSchema = yup.object({
  urlList: yup.array().of(yup.string()).required(),
});

const scraperJSONSchema = yupToJsonSchema(scraperSchema);

const SCRAPE_LIST_PAGES = {
  name: "scrape_list",
  description: "Scrapes a list of pages.",
  category: "scraping",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: scraperJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: true,
  runCmd: async ({ urlList }, memory) => {
    try {
      const config = {
        type: "link",
        whiteList: urlList,
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

module.exports = SCRAPE_LIST_PAGES;
