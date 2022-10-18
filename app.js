const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Redis = require("redis");

const DEFAULT_EXPIRATION = 30;

const redisClient = Redis.createClient();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/data", async (req, res) => {
  redisClient.get("data", async (data, error) => {
    if (data != null) {
      return res.json(JSON.parse(data));
    } else {
      const { data } = await axios.get(
        `http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=json`
      );

      redisClient.setex("data", DEFAULT_EXPIRATION, JSON.stringify(data));
      res.json(data);
    }
  });
});

app.listen(3000, console.log("server is runnning 🏡 on 3000"));
