const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Products = require("./datagenerator/products.json");
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
  let productList = Products.productList;
  let product = productList.filter(prod => prod.id == id);
  console.log("server response", product);

  if (product) {
    res.status(200).json({
      id,
      ...product[0]
    });
  } else {
    res.status(200).json({
      id,
      valid: false
    });
  }
});
