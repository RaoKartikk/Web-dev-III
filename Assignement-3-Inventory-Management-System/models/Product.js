
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            trim: true,
            uppercase: true
        },

        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },

        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0.01, 'Price must be greater than zero']
        },

        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be negative'],
            default: 0
        },

        reorderLevel: {
            type: Number,
            required: true,
            min: 0,
            default: 10
        },

        supplier: {
            type: String,
            required: [true, 'Supplier is required'],
            trim: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Calculate total inventory value
productSchema.virtual('stockValue').get(function () {
    return this.price * this.quantity;
});

module.exports = mongoose.model('Product', productSchema);
