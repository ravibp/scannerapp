const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Server is running.");
});
app.get("/product/:id", (req, res) => {
  let id = parseInt(req.params.id);

  if (id === 1) {
    res.status(200).json({
      id,
      valid: true
    });
  } else {
    res.status(200).json({
      id,
      valid: false
    });
  }
});
