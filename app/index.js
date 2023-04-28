const cheerio = require("cheerio");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config({
  path: "./.env.local",
});
const nodemailer = require("nodemailer");
const cron = reqquire("node-cron");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const crawl = async () => {
  const getContent = async (link) => {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    return $("div.article_view")
      .find("p")
      .map((_, el) => $(el).text().trim())
      .toArray()
      .join("");
  };

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

  const articles = await Promise.all(
    news.map(async ({ title, link }) => ({
      title,
      link,
      article: await getContent(link),
    }))
  );
  return articles;
};

const summarizeUsingGPT = async (article) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "아래 신문기사를 한 문장으로 요약해줘\n\n" + article,
    temperature: 0,
    max_tokens: 1000,
  });
  return response.data.choices[0].text;
};

const send = async (content) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.MAILER_EMAIL,
      clientId: process.env.MAILER_CLIENT_ID,
      clientSecret: process.env.MAILER_CLIENT_PWD,
      refreshToken: process.env.MAILER_REFTKN,
    },
  });

  return await transporter.sendMail({
    from: "NewFeed",
    to: "ephong93@gmail.com",
    subject: "Today's news",
    html: content,
  });
};

const generateContent = async (articles) => {
  const results = await Promise.allSettled(
    articles.map(async ({ title, link, article }) => ({
      title,
      link,
      article: await summarizeUsingGPT(article),
    }))
  );
  const summarizedArticles = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  return summarizedArticles
    .map(
      (item) =>
        `<h1>${item.title}</h1><p>${item.article}</p><a href="${item.link}">원문보기</a>`
    )
    .join("");
};

cron.schedule(
  "0 7 * * *",
  async () => {
    const articles = await crawl();
    const content = await generateContent(articles);
    const info = await send(content);
    console.log(info);
  },
  {
    scheduled: true,
    timezone: "Asia/Seoul",
  }
);
