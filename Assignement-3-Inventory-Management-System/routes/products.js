const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST: Create a new product
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(400).json({
            message: error.code === 11000
                ? 'SKU already exists'
                : error.message
        });
    }
});

// GET: Get all products with filtering, sorting and pagination
router.get('/', async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            search,
            sort = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = new RegExp(`^${category}$`, 'i');
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: 'i'
            };
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Validate pagination
        const currentPage = Math.max(1, parseInt(page) || 1);
        const perPage = Math.min(100, Math.max(1, parseInt(limit) || 10));

        // Allow only approved sorting fields
        const allowedSort = ['name', 'price', 'quantity', 'createdAt'];
        const sortField = allowedSort.includes(sort) ? sort : 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            total,
            page: currentPage,
            totalPages: Math.ceil(total / perPage),
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET: Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: Update product details
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Delete a product
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            id: product._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
