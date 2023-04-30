const { Client } = require("pg");

const dbClient = new Client({
  user: process.env.POSTGRES_USER,
  host: "db",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

dbClient.connect();

exports.dbClient = dbClient;
