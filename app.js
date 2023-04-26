const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path=require('path');
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
(async () => {
  try {
    await mongoose.connect('mongodb+srv://ajitgupta:ajitgupta@cluster0.qjitrd2.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
})();

// Define the product schema
const productSchema = new mongoose.Schema({
  name: String
});

// Define the product model
const Product = mongoose.model('Product', productSchema);

// Configure body-parser to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define the API routes
app.get('/api/products', async (req, res) => {
  try {
    // Retrieve all products from the database
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html');
})

app.get('/api/products/:id', async (req, res) => {
  try {
    // Retrieve a single product by ID from the database
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.send(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.post('/api/products', async (req, res) => {
  console.log("ok")
  try {
    // Create a new product in the database
    const product = new Product({
      name: req.body.name
    });
    await product.save();
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    // Update an existing product in the database
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    }, { new: true });
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.send(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    // Delete a product from the database
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.send(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
