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

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        if (!categories) {
            return res.status(404).json({ success: false, message: "Categories not found" })
        }

        res.status(200).json({ success: true, data: { categories } })

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message })
    }

}
exports.getCategory = async (req, res) => {
    const { id } = req.params
    console.log(req.params.id)
    try {

        const categories = await Category.find({
            $or: [{ _id: id },
            // isActive: true,
            {
                ancestors: {
                    $elemMatch: { _id: id }
                }
            }]
        }).select('_id name slug ancestors')

        if (!categories.length) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }

        const parentCategory = categories.find(category => category._id.equals(id))
        const childCategories = categories.filter(category => !category._id.equals(id))
        console.log(parentCategory)
        const ancestors = parentCategory.ancestors
        const { name, slug } = parentCategory
        console.log(ancestors.length)
        const breadCrumb = ancestors.length == 0 ? {
            href: slug,
            name: name,
        } : ancestors.map((category) => ({
            href: category.slug,
            name: category.name
        })).unshift({
            href: slug,
            name: name,
        })
        // const breadCrumb = ancestors.length === 0 ? { name, slug } : { href: slug, name, ...ancestors.map((category) => ({ name: category.name, slug: category.slug })) }
        console.log(breadCrumb)

        res.status(200).json({ success: true, data: { parentCategory, childCategories, breadCrumb } })

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message })
    }
}
exports.deleteCategory = async (req, res) => {
    const { id } = req.params
    try {
        const deletedCategory = await Category.findByIdAndDelete({ _id: id })
        if (!deletedCategory) {
            return res.status(404).json({ status: false, message: "Category Not Found" })
        }
        const updatedCategory = await Category.updateMany({}, { $pull: { ancestors: { _id: id } } })
        console.log(updatedCategory)
        console.log(deletedCategory)

        res.status(200).json({ success: true, message: "Category successfully deleted", data: deletedCategory })

    } catch (err) {
        rest.status(500).json({ success: false, message: "Server Error", error: err.message })
    }
}