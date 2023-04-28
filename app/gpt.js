const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const summarizeUsingGPT = async (article) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "아래 신문기사를 한 문장으로 요약해줘\n\n" + article,
    temperature: 0,
    max_tokens: 1000,
  });
  return response.data.choices[0].text;
};
