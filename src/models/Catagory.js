const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Category name is required'],
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    trim: true,
  },

  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },

  ancestors: {
    type: [{
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      },
      name: String,
      slug: String,
    }],
    default: []
  },

  image: {
    type: String,
    trim: true,
    default: null
  },

  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  isActive: {
    type: Boolean,
    default: true
  },

});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;