const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Application started and listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello world! This is working");
  res.sendFile(`${__dirname}/docs/index.html`);
});