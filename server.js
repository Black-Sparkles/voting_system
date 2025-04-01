const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const client = redis.createClient({
  //url: 'redis://:DmLWljBuOZq062KO5vH8pzkWPRIE4EMB9AzCaBO1jyE=@redisteam1.redis.cache.windows.net:6379'
  url: <yourRedisURL>
});

// Redis connection events
client.on("error", (err) => console.error("Redis error:", err));
client.on("connect", () => console.log("✅ Connected to Redis"));

app.use(bodyParser.json());
app.use(express.static("public"));

// API routes
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

// Start the app after Redis connects
client.connect()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to Redis:", err);
    process.exit(1);
  });
