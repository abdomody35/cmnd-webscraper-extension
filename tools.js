const fs = require('fs');
const path = require('path');

const toolsDirectory = path.join(__dirname, 'tools');
const tools = [];

const files = fs.readdirSync(toolsDirectory);

for (const file of files) {
  if (file.endsWith('.js')) {
    const toolPath = path.join(toolsDirectory, file);
    const tool = require(toolPath);
    tools.push(tool);
  }
}

module.exports = tools;