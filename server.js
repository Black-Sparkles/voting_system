const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");

const app = express();
const PORT = process.env.PORT || 3000;

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://team1:6379",
});

client.on("error", (err) => console.error("Redis error:", err));

client.connect();

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/vote", async (req, res) => {
  const option = req.body.option;
  await client.incr(option);
  res.sendStatus(200);
});

app.get("/results", async (req, res) => {
  const keys = ["JavaScript", "Python", "Java"];
  const results = {};
  for (const key of keys) {
    results[key] = parseInt(await client.get(key)) || 0;
  }
  res.json(results);
});

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
client.on("error", (err) => {
  console.error("Redis error:", err);
});
client.on("connect", () => {
  console.log("Connected to Redis");
});
app.get("/health", (req, res) => {
  res.send("OK");
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
