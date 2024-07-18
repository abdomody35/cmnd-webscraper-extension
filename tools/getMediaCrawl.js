const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("../yupToJsonSchema");

const scraperSchema = yup.object({
  baseUrl: yup.string().required(),
});

const scraperJSONSchema = yupToJsonSchema(scraperSchema);

const SCRAPER = {
  name: "media_crawler",
  description:
    "Gets all image, audio, video and other media links all pages starting from the base url. (in test)",
  category: "media",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: scraperJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ url }, memory) => {
    try {
      const response = await axios.post(
        "http://localhost:6969/api/scrape?url=" + url
      );
      const mediaItem = response.data.filter((item) =>
        item.title.endsWith(" - media")
      );
      mediaItem ? (memory[mediaItem.title] = mediaItem.content) : {};
      return {
        responseString: "Scraping completed successfully",
        memory: memory,
      };
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};
module.exports = SCRAPER;
