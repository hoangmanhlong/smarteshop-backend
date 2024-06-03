import express from 'express';
import { readFileSync } from 'fs';

const app = express();
const port = 3000;

// Endpoint to get product by ID
// app.get('/products/:id', (req, res) => {
//   const product = products.find(p => p.id == req.params.id);
//   if (product) {
//     res.json(product);
//   } else {
//     res.status(404).json({ error: 'Product not found' });
//   }
// });

// Endpoint to get all products with skip and limit
app.get('/products', (req, res) => {
    // Load product data
    let productsData = undefined;
    let products = undefined;
    try {
        productsData = JSON.parse(readFileSync('products.json', 'utf8'));
        products = productsData.products;
    } catch (e) {
        products = []
    }

    let { skip, limit } = req.query;

    // Default values if skip and limit are not provided
    skip = parseInt(skip) || 0;
    limit = parseInt(limit) || 0;

    // Get the selected products
    const selectedProducts = products.slice(skip, limit === 0 ? products.length : skip + limit);

    // Prepare the response
    const response = {
        products: selectedProducts,
        total: selectedProducts.length,
        skip,
        limit
    };

    res.json({
        code: 200,
        status: 1,
        data: response,
        message: ''
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});