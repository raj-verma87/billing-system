const Product = require('../models/Product');
const Category = require('../models/Category');

// Create a new product
const createCategory = async(req,res)=>{
    try{
        const {name} = req.body;
        const category = await Category.create({name});
        res.status(201).json(category);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}
//Get all categories
const getAllCategories = async(req,res)=>{
    try{
        const categories = await Category.findAll({
            include:Product
        });
        res.status(200).json(categories);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}
// Get a single category by ID
const getCategoryById = async(req,res)=>{
    try{
        const {id} = req.params;
        const category = await Category.findByPk(id,{include: Product})
        if(!category) return res.status(404).json({error: error.message});
        res.status(200).json(category);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}
//Update a category
const updateCategory = async(req,res)=>{
    try{
        const {id} = req.params;
        const {name} = req.body;
        const category = await Category.findByPk(id);
        if(!category) return res.status(404).json({error: error.message});

        await category.update({name});
        res.status(200).json(category);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}
//Delete a category
const deleteCategory = async(req,res)=>{
    try{
        const {id} = req.params;
        const category = await Category.findByPk(id);
        if(!category) return res.status(404).json({error: error.message});

        await category.destroy();
        res.status(200).json({message : 'category deleted'});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
