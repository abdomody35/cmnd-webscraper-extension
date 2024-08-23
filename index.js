require("dotenv").config();
const PORT = process.env.PORT || 8000;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const tools = require("./tools");
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the CMND.AI WebScraper Extension" });
});

app.get("/cmnd-tools", (req, res) => {
  const getTools = () => {
    const toolsMapped = tools.map((t) => {
      return {
        name: t.name,
        description: t.description,
        jsonSchema: t.parameters,
        isDangerous: t.dangerous,
        functionType: t.functionType,
        isLongRunningTool: t.isLongRunningTool,
        rerun: t.rerun,
        rerunWithDifferentParameters: t.rerunWithDifferentParameters,
      };
    });
    return { tools: toolsMapped };
  };

  const toolsResponse = getTools();
  res.json(toolsResponse);
});

app.post("/run-cmnd-tool", async (req, res) => {
  const args = req.body;
  const toolToRun = tools.find((t) => t.name === args.toolName);
  const results = await toolToRun.runCmd(args.props, args.memory);
  res.send(results);
});

app.listen(PORT, () =>
  console.log(`server running on PORT http://localhost:${PORT}`)
);
