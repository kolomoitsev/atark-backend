
const express = require('express')
const router = express.Router()

const BOOK = require('../../models/book.model')
const TRANSPORT = require('../../models/transport.model')
const INFO = require('../../models/info.model')

const authenticateToken = require('./helpers')


router
    //get all info
    .get('/', authenticateToken, async (req, res) => {

        const info = await INFO.find({})

        res.json({ info })

    })
    //get info by exact book id
    .get('/book/:book_id', authenticateToken, async (req, res) => {

        const book_id = req.params.book_id

        const info = await INFO.find({
            book_id: book_id
        })

        res.json({ info })

    })
    //add info
    .post('/:book_id', async (req, res) => {

        const book_id = req.params.book_id

        const info_lat = req.body.info_lat
        const info_lng = req.body.info_lng
        const info_time = req.body.info_time
        const info_temperature = req.body.info_temperature
        const info_humidity = req.body.info_humidity


        const  info = new INFO({
            book_id: book_id,
            info_lat: info_lat,
            info_lng: info_lng,
            info_time: info_time,
            info_temperature: info_temperature,
            info_humidity: info_humidity,
        })

        await info.save()
            .then(r => res.json({ message: `added`, r }))
            .catch(e => res.json({ error: e }))

    })
    //delete info
    .delete('/:info_id', authenticateToken, async (req, res) => {

        const info_id = req.params.info_id

        await INFO.findByIdAndDelete(info_id)
            .then(() => res.json({ message: `deleted` }))
            .catch(e => res.json({ error: e }))
    })

module.exports = router