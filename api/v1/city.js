const express = require('express')
const router = express.Router()

const CITY = require('../../models/city.model')

const authenticateToken = require('./helpers')

router
    //get cities
    .get('/', authenticateToken,  async (req, res) => {

        await CITY.find({})
            .then(cities => res.json(cities))
            .catch(error => res.json({ message: error } ))

    })
    //get exact city info by city id
    .get('/find', authenticateToken, async (req, res) => {

        await CITY.findOne({
            _id: req.body.city_id
        })
            .then(city => res.json(city))
            .catch(err => res.json({ message: `not cities found by following id, ${err}` }))


    })
    //get exact city info by city name
    .get('/find/:name', authenticateToken, async (req, res) => {

        await CITY.findOne({
            city_name:  req.params.name.charAt(0).toLocaleUpperCase() + req.params.name.slice(1)
        })
            .then(city => res.json(city))
            .catch(err => res.json({ message: `no such cities found` }))

    })
    //get cities autocomplete
    .get('/autocomplete/:city', authenticateToken, async (req, res) => {

        const searching_item = req.params.city.charAt(0).toLocaleUpperCase() + req.params.city.slice(1)

        await CITY.find({ city_name: { $regex: `${searching_item}` } })
            .then(cities => res.json({ cities } ))
            .catch(err => res.json({ message: err }))

    })
    //get cities by country id
    .get('/country/:country_id', authenticateToken, async (req, res) => {

        await CITY.find({
            country_id: req.params.country_id
        })
            .then(cities => res.json(cities))
            .catch(err => res.json({ message: err }))

    })

module.exports = router