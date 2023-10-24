const OpenAi = require("openai");

const openAIClient = new OpenAi({
  apiKey: process.env.OPENAI_KEY,
});

const generateSTEMProblems = async (systemMessage, userMessage) => {
  const response = await openAIClient.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });
  return JSON.parse(response.choices[0].message.content);
};

module.exports = {
  generateSTEMProblems,
};
