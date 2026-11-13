
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

// Product Routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(error => console.error('MongoDB Error:', error));

// Home Route
app.get('/', (req, res) => {
    res.json({ message: 'Inventory Management API is running' });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
