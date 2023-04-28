const cheerio = require("cheerio");
const axios = require("axios");

const getContent = async (link) => {
  const { data } = await axios.get(link);
  const $ = cheerio.load(data);
  return $("div.article_view")
    .find("p")
    .map((_, el) => $(el).text().trim())
    .toArray()
    .join("");
};

const crawlNews = async () => {
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
  console.log(news);

  const articles = await Promise.all(
    news.map(async ({ title, link }) => ({
      title,
      link,
      article: await getContent(link),
    }))
  );
  console.log(articles);
  return articles;
};

exports.crawlNews = crawlNews;
