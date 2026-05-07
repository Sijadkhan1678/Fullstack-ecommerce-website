const express = require("express")
const router = express.Router()
const { createCategory, getCategories, getCategory, deleteCategory } = require("../controllers/categories.controller")

router.post('/',createCategory) 
router.get('/', getCategories)
router.get('/:id', getCategory)
router.delete('/:id', deleteCategory)

exports.categoriesRoutes = router
