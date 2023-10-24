const OpenAi = require("openai");
require("dotenv").config();

const openai = new OpenAi({
  apiKey: process.env.OPENAI_KEY,
});

module.exports = openai;
