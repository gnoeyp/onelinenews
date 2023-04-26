const cheerio = require("cheerio");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config({
  path: "./.env.local",
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const main = async () => {
  const { data } = await axios.get("https://news.daum.net/");

  const $ = cheerio.load(data);

  const news = $("ul.list_newsissue")
    .find("div.item_issue")
    .find("div.cont_thumb")
    .map((_, el) => ({
      title: $(el).find("strong").text().trim(),
      link: $(el).find("a").attr("href"),
    }))
    .toArray();

  const getContent = async (link) => {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    return $("div.article_view")
      .find("p")
      .map((_, el) => $(el).text().trim())
      .toArray()
      .join("");
  };

  const articles = await Promise.all(
    news.map(async ({ title, link }) => ({
      title,
      link,
      article: await getContent(link),
    }))
  );

  const summarizedArticles = await Promise.all(
    articles.map(async ({ title, link, article }) => ({
      title,
      link,
      article: await summarizeUsingGPT(article),
    }))
  );
  console.log(summarizedArticles);
};

const summarizeUsingGPT = async (article) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "아래 신문기사를 한 문장으로 요약해줘\n\n" + article,
      temperature: 0,
      max_tokens: 1000,
    });
    return response.data.choices[0].text;
  } catch {
    return "error";
  }
};

main();
