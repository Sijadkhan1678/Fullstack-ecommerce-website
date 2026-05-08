const express = require("express")
const router = express.Router()
const { categoryValidationRules, validate } = require("../middlewares/categoryValidator")
const { createCategory, getCategories, getCategory, deleteCategory } = require("../controllers/categories.controller")

router.post('/', [categoryValidationRules(), validate], createCategory)
router.get('/', getCategories)
router.get('/:id', getCategory)
router.delete('/:id', deleteCategory)

exports.categoriesRoutes = router
