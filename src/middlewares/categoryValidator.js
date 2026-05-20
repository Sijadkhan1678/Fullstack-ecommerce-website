const { body, validationResult } = require('express-validator');

const categoryValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('category name is required').trim(),
    body('slug').optional().isString().withMessage("slug should be string").isSlug().withMessage("Provide valid slug"),
    body("image").optional().isURL().withMessage("Provide valid image URL").trim(),
    body('parentId').optional().trim().isMongoId().withMessage("ParentId category should be MongoId"),
    body('description').optional().isString().withMessage('image must be a string URL').trim()
  ];
};

// Middleware to handle the errors
const validate = (req, res, next) => {
  
  // req.body["categoryImage"] = "categoryimages"
  console.log(req.body,typeof req.body.categoryImage)
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  categoryValidationRules,
  validate,
};