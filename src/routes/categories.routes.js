const express = require("express")
const router = express.Router()
const { categoryValidationRules, validate } = require("../middlewares/categoryValidator")
const categoryImageUPloader = require("../middlewares/uploader")
const { createCategory, getCategories, getCategory, deleteCategory } = require("../controllers/categories.controller")

router.post('/', [/*categoryImageUPloader*/,categoryValidationRules(), validate], createCategory)
router.get('/', getCategories)
router.get('/:id', getCategory)
router.delete('/:id', deleteCategory)

exports.categoriesRoutes = router
