require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
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
    "Gets information about a company, institution, etc from the name.",
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
      const googleSearchUrl = `https://www.google.com/search?q=about+${encodeURIComponent(
        name
      )}`;

      const googleResponse = await axios.get(googleSearchUrl);

      const $ = cheerio.load(googleResponse.data);
      const allLinks = $("#search a")
        .map((index, element) => $(element).attr("href"))
        .get();

      const filteredLinks = allLinks.filter(
        (link) => link && !link.includes("google.com/search")
      );

      if (filteredLinks.length === 0) {
        throw new Error("No valid search results found");
      }

      const firstLink = filteredLinks[0];
      console.log("First link:", firstLink);

      const config = { type: "link" };
      const response = await axios.post(
        API + "/scrape?url=" + firstLink,
        config
      );

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
