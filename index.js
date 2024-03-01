const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ messgae: "OK" });
});

app.listen(port, () => {
  console.log(`my server is running port ${port}`);
});
