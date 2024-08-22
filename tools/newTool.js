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
      console.log("Getting information on " + name);
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(
        `https://www.google.com/search?q=about+${name.replace(" ", "+")}`
      );
      await page.waitForSelector("#search a");
      const links = await page.$$eval("#search a", (links) =>
        links
          .map((link) => link.href)
          .filter((link) => !link.includes("google.com/search"))
      );
      const url = links[0];
      await browser.close();
      const config = {
        type: "link",
      };
      const response = await axios.post(API + "/scrape?url=" + url, config);
      for (const { title, content } of response.data) {
        memory[name] = { title: title, content: content };
      }
      console.log("Successful");
      return {
        responseString:
          "Scraping completed successfully. Data has been saved in the memory.",
        memory: memory,
      };
    } catch (err) {
      console.error("Error:", err);
      return "Error trying to execute the tool";
    }
  },
};

module.exports = CRAWL_USING_REGEX;
