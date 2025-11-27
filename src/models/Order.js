const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    item: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentDetails: {
    method: { type: String, required: true },
    transactionId: { type: String },
    paid: { type: Boolean, default: false }
  }

}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)