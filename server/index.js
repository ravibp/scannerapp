var express = require("express");
var bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
