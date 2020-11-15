const express = require('express')
const router = express.Router()

const TARIFF = require('../../models/tariff.model')

const authenticateToken = require('./helpers')

router
    // get all tariffs
    .get('/', authenticateToken, async (req, res) => {
        const tariffs = await TARIFF.find({})
        res.json( tariffs && tariffs.length  ? { tariffs } : { error: `no tariffs` })
    })
    //get exact tariff by tariff_id
    .get('/:tariff_id', authenticateToken, async (req, res) => {

        const tariff_id = req.params.tariff_id

        const tariffs = await TARIFF.findById(tariff_id)

        res.json( tariffs ? { tariffs } : { message: `no tariffs` } )

    })
    //get tariff by category id
    .get('/category/:category_id', authenticateToken, async (req, res) => {

        const category_id = req.params.category_id

        const tariffs = await TARIFF.find({
            category_id : category_id,
        })
            .catch(e => res.json({ message: e }))

        res.json( tariffs && tariffs.length ? { tariffs } : { message: `no tariffs by this category` })

    })
    //add new tariff
    .post('/', authenticateToken, async (req, res) => {

        const category_id = req.body.category_id
        const tariff_name = req.body.tariff_name
        const tariff_description = req.body.tariff_description
        const tariff_price = req.body.tariff_price
        const tariff_length = req.body.tariff_length

        const tariff = new TARIFF({
            category_id: category_id,
            tariff_name: tariff_name,
            tariff_description: tariff_description,
            tariff_price: tariff_price,
            tariff_length: tariff_length
        })

        await tariff.save()
            .then(r => res.json({ message: `category added`, r }))
            .catch(e => res.json({ error : e }))
    })
    //edit tariff by tariff id
    .patch('/:tariff_id', authenticateToken, async (req ,res) => {

            const tariff_id = req.params.tariff_id

            const category_id =  req.body.category_id
            const tariff_name = req.body.tariff_name
            const tariff_description =  req.body.tariff_description
            const tariff_price = req.body.tariff_price
            const tariff_length = req.body.tariff_length

            await TARIFF.findByIdAndUpdate({
                _id : tariff_id
            }, {
                category_id : category_id,
                tariff_name : tariff_name,
                tariff_description: tariff_description,
                tariff_price: tariff_price,
                tariff_length: tariff_length
            })
                .then( r => res.json({ message: `updated`, r }))
                .catch( e => res.json({ error:  e }) )
    })
    //delete tariff
    .delete('/:tariff_id', authenticateToken, async (req, res) => {
        const tariff_id = req.params.tariff_id



        await TARIFF.findByIdAndDelete(tariff_id)
            .then(r => res.json(!r ? { error: `not found` } : { message: `deleted` }))
            .catch(e => res.json({ error: e }))
    })
    //tariff autocomplete
    .get('/autocomplete/:tariff_name', authenticateToken, async (req, res) => {

        const tariff_name = req.params.tariff_name

        await TARIFF.find({ tariff_name: { $regex: `${tariff_name}`, $options: 'i' } })
            .then(tariffs => res.json({ tariffs } ))
            .catch(() => res.json({ message: `no tariffs` }))

    })

module.exports = router