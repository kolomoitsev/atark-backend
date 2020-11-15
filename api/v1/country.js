const express = require('express')
const router = express.Router()

const COUNTRY = require('../../models/coutry.model')

const authenticateToken = require('./helpers')

router
    //get countries
    .get('/', authenticateToken,  async (req, res) => {

        await COUNTRY.find({})
            .then(countries => res.json(countries))
            .catch(error => res.json({ message: error} ))

    })
    //get exact country info by country id
    .get('/find', authenticateToken, async (req, res) => {

        await COUNTRY.findOne({
            _id: req.body.country_id
        })
            .then(country => res.json(country))
            .catch(err => res.json({ message: `not found by following id` }))


    })
    //get exact country info by country name
    .get('/find/:name', authenticateToken, async (req, res) => {

        await COUNTRY.findOne({
            country_name:  req.params.name.charAt(0).toLocaleUpperCase() + req.params.name.slice(1)
        })
            .then(country => res.json(country))
            .catch(err => res.json({ message: `no such country found` }))

    })
    //get autocomplete countries by country name (regexp)
    .get('/autocomplete/:country', authenticateToken, async (req, res) => {

        const searching_item = req.params.country.charAt(0).toLocaleUpperCase() + req.params.country.slice(1)

        await COUNTRY.find({ country_name: { $regex: `${searching_item}` } })
            .then(countries => res.json({ countries } ))
            .catch(err => res.json({ message: err }))

    })

module.exports = router