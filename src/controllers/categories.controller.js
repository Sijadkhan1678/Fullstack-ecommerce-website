const Category = require("../models/Catagory")


exports.createCategory = async (req, res) => {
    try {
        const { name, slug, image, parentId, description, isActive } = req.body

        // db call for category whether category exist or not on basis of name and slug or parentId  

        const existCategory = await Category.findOne({ $or: [{ name }, { _id: parentId }] }).select("_id name slug ancestors");
        // console.log(existCategory?._id)
        const category = new Category({ name, slug, image, description, isActive, })
        // console.log(category)
        if (existCategory.name === name) {

            return res.status(409).json({ success: false, message: 'category already exist with this name' })

        }
        if (existCategory.ancestors.find((category) => name === name)) {
            return res.status(409).json({ success: false, message: "this" })
        }
        // check for parent category existence in the database 
        if (existCategory?._id.equals(parentId)) {
            console.log("parentId === existcategoryid")
            const { _id, name, slug, ancestors, } = existCategory
            const parentCategory = {
                _id,
                name,
                slug
            }
            ancestors.length ? category.ancestors.push(...ancestors, parentCategory) : category.ancestors.push(parentCategory)
            category.slug = slug + '-' + category.slug
            category.parentId = parentId
        }

        await category.save()
        res.status(201).json({ success: true, data: { category } })
    } catch (err) {
        if (err.code === 11000) {
            const { name, slug } = err.keyValue
            errorMessage = name ? `${name} category already exist` : `${slug} slug already exist`
            res.status(409).json({ success: false, message: errorMessage })

        } else {
            res.status(500).json({ success: false, message: "server error", error: err.message })

        }
    }
}

}

exports.getCategories = async (req, res) => {
    try {
        return res.status(404).json({ message: "categories" })
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message })
    }
}
exports.getCategory = async (req, res) => {

    try {
        res.status(200).json({ messge: "get single category" })
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message })
    }

}

exports.deleteCategory = async (req, res) => {
    const { id } = req.params
    try {

        res.status(200).json({ success: true, message: "Category successfully deleted" })

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message })
    }
}