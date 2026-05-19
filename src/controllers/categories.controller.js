const Category = require("../models/Catagory")


exports.createCategory = async (req, res) => {
    try {
        const { name, slug, image, parentId, description, isActive } = req.body;

        // db call for category whether category exist or not on basis of name and slug or parentId  
        if (!parentId) {

            const existCategory = await Category.findOne({ $or: [{ name, parentId: null }, { name, parentId: null }] }).select("_id name slug ancestors");

            if (existCategory?.name === name) {

                return res.status(409).json({ success: false, message: "Category already exist with this name" })
            }

            if (existCategory?.slug === slug) {
                return res.status(409).json({ success: false, message: "Category already exist with this slug" })
            }

            const category = new Category({ name, slug, image, description, isActive });
            await category.save()
            res.status(201).json({ success: true, data: { category } })

        }

        if (parentId) {

            const categories = await Category.find({ $or: [{ _id: parentId }, { parentId: parentId }] }).select("_id name slug parentId ancestors")

            const parentCategory = categories.find(category => category._id?.toString() === parentId)

            const childCategories = categories.filter(category => category.parentId?.toString() === parentId)

            const isDuplicateChildName = childCategories.some(childCategory => childCategory.name === name)

            if (isDuplicateChildName) {
                return res.status(409).json({ success: false, message: "child Category already exist with this name" })
            }
            if (parentCategory.slug === slug) {
                return res.status(409).json({ success: false, message: "Category already exist with this slug" })
            }
            if (!parentCategory) {
                return res.status(404).json("ParentCategory Not Found")
            }

            if (parentCategory?.name === name) {

                return res.status(409).json({ success: false, message: `${name} cant takeover its parent category name` })

            }

            const category = new Category({ name, slug, image, description, parentId, isActive });

            category.slug = `${parentCategory.slug}-${category.slug}`

            const isChildSlugDuplicated = childCategories.some(childCategory => childCategory.slug === category.slug)

            if (isChildSlugDuplicated) {
                return res.status(409).json({ success: false, message: "Category already exist with this slug" })
            }

            category.ancestors.push(...existingParentCategory.ancestors, {
                name: existingParentCategory.name,
                slug: existingParentCategory.slug
            })
            await category.save()
            res.status(201).json({ success: true, data: { category } })

        }


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
    try {

        const categories = await Category.find({
            $or: [
                { _id: id },
                { parentId: id },
            ]
        }).select('_id name slug image ancestors')

        if (!categories.length) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }

        const category = categories.find(category => category._id.equals(id))

        const childeren = categories.filter(category => !category._id.equals(id))

        const { name, slug,ancestors } = category

        console.log(ancestors.length)

        const path = ancestors.map((category) => ({
            href: category.slug,
            name: category.name
        }))

       path.push({name,slug})

        res.status(200).json({ success: true, data: { category, childeren, path } })

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