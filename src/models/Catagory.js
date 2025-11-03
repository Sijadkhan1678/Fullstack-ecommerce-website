const mongoose = require('mongoose');
const { Schema } = mongoose;

// Main Category Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },

  image: {
    type: String,
    trim: true,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        return value.startsWith('/images/categories/');
      },
      message: 'Image path must start with /images/categories/'
    }
  },

  level: {
    type: Number,
    required: [true, 'Level is required'],
    min: [1, 'Level must be at least 1'],
    max: [3, 'Level cannot exceed 3']
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  isActive: {
    type: Boolean,
    default: true
  },
  
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
    validate: {
      validator: function(value) {
        // ParentId should be null for level 1 categories
        if (this.level === 1) {
          return value === null;
        }
        // For level 2+, parentId must reference an existing category
        return value !== null;
      },
      message: 'Level 1 categories must have null parentId, other levels must have valid parentId'
    }
  },
});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;