require("dotenv").config();
const puppeteer = require("puppeteer");
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");
const API = process.env.API_URL;

const crawlerSchema = yup.object({
  name: yup.string().required(),
});

const crawlerJSONSchema = yupToJsonSchema(crawlerSchema);

const CRAWL_USING_REGEX = {
  name: "get_information",
  description:
    "Gets information about a company, inistiution, etc from the name.",
  category: "info",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: crawlerJSONSchema,
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async ({ name }, memory) => {
    try {
      const browser = await puppeteer.launch();
      console.log("browser launched");
      const page = await browser.newPage();
      console.log("page opened");
      await page.goto(`https://www.google.com/search?q=about%20${name}`);
      console.log("navigated");
      await page.waitForSelector("#search a");
      console.log("waited for results");
      const links = await page.$$eval("#search a", (links) =>
        links.map((link) => link.href)
      );
      console.log("got links " + links);
      const url = links[0];
      console.log("got url " + url);
      await browser.close();
      console.log("browser Closed");
      const config = {
        type: "link",
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
      return "Error trying to execute the tool";
    }
  },
};

module.exports = CRAWL_USING_REGEX;
