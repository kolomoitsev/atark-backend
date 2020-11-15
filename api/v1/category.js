const express = require('express')
const router = express.Router()

const CATEGORY = require('../../models/category.model')

const authenticateToken = require('./helpers')

router
    //get categories
    .get('/', authenticateToken,  async (req, res) => {

        await CATEGORY.find({})
            .then(categories => res.json( categories ))
            .catch(error => res.json({ message: `an error occurred`, error } ))

    })
    //add new category
    .post('/', authenticateToken, async (req, res) => {

        const term = new CATEGORY({
            category_name: req.body.category_name,
            category_description: req.body.category_description,
            category_image: req.body.category_image
        })

        await term.save()
            .then(q => res.json(q))
            .catch(err => res.json({ message: err }))

    })
    //edit category
    .patch('/:category_id', authenticateToken, async (req, res) => {

        const category_id = req.params.category_id

        const category_name = req.body.category_name
        const category_description = req.body.category_description || null
        const category_image = req.body.category_image || null

        CATEGORY.findByIdAndUpdate(category_id, {
            category_name: category_name,
            category_description: category_description,
            category_image: category_image,
        })
            .then(() => res.json({ message: `updated` }))
            .catch(err => res.json({ error: err }))

    })
    //get exact category by name
    .get('/find/:category_name', authenticateToken, async (req, res) => {

        const category_name = req.params.category_name

        await CATEGORY.find({
            category_name: category_name
        })
            .then(categories => res.json(categories))
            .catch(error => res.json({ message: `no category`, error } ))


    })
    //get exact category by id
    .get('/find/id/:category_id', authenticateToken, async (req, res) => {

        const category_id = req.params.category_id

        await CATEGORY.find({
            _id: category_id
        })
            .then(categories => res.json(categories))
            .catch(error => res.json({ message: `no category`, error } ))


    })
    //delete category by id
    .delete('/delete/:category_id', authenticateToken, async (req, res) => {

        const category_id = req.params.category_id

        await CATEGORY.deleteOne({
            _id: category_id
        })
            .then(() => res.json({ message: `category deleted` }))
            .catch(err => res.json({ error: err }))

    })
    //get categories autocomplete
    .get('/autocomplete/:category_name', authenticateToken, async (req, res) => {

        const category_name = req.params.category_name

        await CATEGORY.find({ category_name: { $regex: `${category_name}` } })
            .then(categories => res.json({ categories } ))
            .catch(() => res.json({ message: `no cities` }))

    })

module.exports = router