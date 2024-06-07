import express from "express";
import { readFileSync } from "fs";
import morgan from "morgan";

const app = express(); // create instance of express named app
app.use(morgan("combined"));
const port = 3000; // define a port that server will listener
const data_source_path = "../data_source/products.json"; // data source path

// create listener get products list from requestes
app.get("/products", (req, res) => {
  try {
    let products = [];

    try {
      const productsData = JSON.parse(readFileSync(data_source_path, "utf8")); // read data from above path
      products = productsData.products; // get products list in data source
    } catch (e) {
      // handle error
      console.error("Error reading products data:", e);
    }

    let { skip = 0, limit = 0 } = req.query; // read params from request

    // parse param to Int
    skip = parseInt(skip);
    limit = parseInt(limit);

    // Validate skip and limit
    if (isNaN(skip) || skip < 0) skip = 0;
    if (isNaN(limit) || limit < 0) limit = 0;

    // Get the selected products
    const selectedProducts = products.slice(
      skip,
      limit === 0 ? products.length : skip + limit
    );

    // Prepare the response
    const response = {
      products: selectedProducts,
      total: selectedProducts.length,
      skip,
      limit,
    };

    res.json({
      code: 200,
      status: 0,
      data: response,
      message: "",
    });
  } catch (e) {
    res.json({
      code: 500,
      status: 0,
      data: {},
      message: "Error",
    });
  }
});

app.listen(port, () => console.log(`Server is running in ${port}`));
