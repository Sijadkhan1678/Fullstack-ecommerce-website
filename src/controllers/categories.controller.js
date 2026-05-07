const Category = require("../models/Catagory")


exports.createCategory = async (req, res) => {
    try {
        const { name, slug, image, parentId, description, isActive } = req.body
        res.status(201).json({ message: "create category" })
    } catch (err) {
        rest.status(500).json({ success: false, message: "Server Error", error: err.message })
    }

}

exports.getCategories = async (req, res) => {
    try {
        return res.status(404).json({ message: "categories" })
    } catch (err) {
        rest.status(500).json({ success: false, message: "Server Error", error: err.message })
    }
}
exports.getCategory = async (req, res) => {

    try {
        res.status(200).json({ messge: "get single category" })
    } catch (err) {
        rest.status(500).json({ success: false, message: "Server Error", error: err.message })
    }

}

exports.deleteCategory = async (req, res) => {
    const { id } = req.params
    try {

        res.status(200).json({ success: true, message: "Category successfully deleted" })

    } catch (err) {
        rest.status(500).json({ success: false, message: "Server Error", error: err.message })
    }
}