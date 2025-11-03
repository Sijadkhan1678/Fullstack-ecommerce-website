const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  items:[
    {
    type: mongoose.SchemaTypes.ObjectId,
    
    }
  ],
  address: {
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    street: {
      type: String,
    },

    postal_code: {
      type: String,
    },
  },
  shipping_adderss: {

  }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)