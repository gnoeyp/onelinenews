require("dotenv").config({
  path: "./.env.local",
});
const cron = require("node-cron");
const { send } = require("./email");
const { summarizeUsingGPT } = require("./gpt");
const { crawlNews } = require("./crawl");
const { dbClient } = require("./db");

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
    console.log("START CRAWLING...");
    const articles = await crawlNews();
    console.log("SUMMARIZING ARTICLES...");
    const content = await generateContent(articles);
    console.log("-----------CONTENT------------");
    console.log(content);
    console.log("SENDING EMAIL...");

    dbClient.query('SELECT * FROM "user"', (error, result) => {
      if (error) {
        console.log(error);
      }

      if (result) {
        result.rows.forEach((row) => {
          console.log("TO: ", row.email);
          send(content, row.email);
        });
      }
    });
  },
  {
    scheduled: true,
    timezone: "Asia/Seoul",
  }
);
