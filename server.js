const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Placeholder Redis URL for cloud-init to replace
const client = redis.createClient({
  url: '<yourRedisURL>', // this will be replaced dynamically via sed
});

client.on("error", (err) => console.error("Redis error:", err));
client.on("connect", () => console.log("Connected to Redis"));

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

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
