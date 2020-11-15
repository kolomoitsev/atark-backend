const express = require('express')
const router = express.Router()

const authenticateToken = require('./helpers')

const TRANSPORT = require('../../models/transport.model')

router

    //get all transport
    .get('/', authenticateToken, async (req, res) => {
        await TRANSPORT.find({})
            .then(transport => res.json({ transport }))
            .catch(err => res.json({ error : err }))
    })
    //add transport item
    .post('/', authenticateToken, async (req, res) => {

        const category_id = req.body.category_id
        const point_id = req.body.point_id
        const transport_name = req.body.transport_name
        const transport_serial_number = req.body.transport_serial_number
        const transport_insurance_number = req.body.transport_insurance_number

        const transport = new TRANSPORT({
            category_id : category_id,
            point_id : point_id,
            transport_name: transport_name,
            transport_serial_number: transport_serial_number,
            transport_insurance_number: transport_insurance_number
        })

        await transport.save()
            .then(() => res.json({ message: `transport added` }))
            .catch(err => res.json({ error : `an error occurred during adding new transport item`, err }))

    })
    //edit transport info
    .patch('/', authenticateToken, async (req, res) => {

        const transport_id = req.body.transport_id

        const category_id = req.body.category_id
        const point_id = req.body.point_id
        const transport_name = req.body.transport_name
        const transport_serial_number = req.body.transport_serial_number
        const transport_insurance_number = req.body.transport_insurance_number

        // check if transport locked

        const transport = await TRANSPORT.findById(transport_id)

        if(transport && transport.transport_status === 'locked') return res.json({ error : `transport locked` })

        await TRANSPORT.findByIdAndUpdate({
            _id: transport_id,
        }, {
            category_id: category_id,
            point_id: point_id,
            transport_name: transport_name,
            transport_serial_number: transport_serial_number,
            transport_insurance_number: transport_insurance_number,
        })
            .then(() => res.json({ message: `transport info updated` }))
            .catch(err => res.json({ error: err }))
    })
    //delete transport
    .delete('/', authenticateToken, async (req, res) => {

        const transport_id = req.body.transport_id

        // check if transport locked

        const transport = await TRANSPORT.findById(transport_id)

        if(transport && transport.transport_status === `locked`) return res.json({ error : `transport locked` })

        await TRANSPORT.deleteOne({
            _id: transport_id
        })
            .then(() => res.json({ message: `transport deleted` }))
            .catch(err => res.json({ error: err }))

    })
    //get transport by id
    .get('/:transport_id', authenticateToken, async (req, res) => {

        const transport_id = req.params.transport_id

        const transport = await TRANSPORT.findById(transport_id)

        res.json(transport)

    })
    //get transport by name
    .get('/name/:transport_name', authenticateToken, async (req, res) => {

        const transport_name = req.params.transport_name

        const transport = await TRANSPORT.find({
            transport_name: transport_name
        })

        res.json(transport)

    })
    //get transport by point id
    .get('/point/:point_id', authenticateToken, async (req, res) => {

        const point_id = req.params.point_id

        const transport = await TRANSPORT.find({
            point_id: point_id
        })

        res.json(transport)

    })
    //get transport by category id
    .get('/category/:category_id', authenticateToken, async (req, res) => {

        const category_id = req.params.category_id

        const transport = await TRANSPORT.find({
            category_id: category_id
        })

        res.json(transport)

    })
    //lock transport
    .patch('/lock/:transport_id', authenticateToken, async (req, res) => {

        const transport_id = req.params.transport_id

        await TRANSPORT.findByIdAndUpdate({
            _id : transport_id
        }, {
            transport_status  : `locked`
        })
            .then(() => res.json({ message : `transport locked` }))
            .catch(err => res.json({ error: err }))

    })
    //unlock transport
    .patch('/unlock/:transport_id', authenticateToken, async (req, res) => {
        const transport_id = req.params.transport_id

        await TRANSPORT.findByIdAndUpdate({
            _id : transport_id
        }, {
            transport_status  : `active`
        })
            .then(() => res.json({ message : `transport unlocked` }))
            .catch(err => res.json({ error: err }))
    })
    //get transport autocomplete
    .get('/autocomplete/:transport_serial_number', authenticateToken, async (req, res) => {

        const transport_serial_number = req.params.transport_serial_number

        await TRANSPORT.find({ transport_serial_number: { $regex: `${transport_serial_number}`, $options: 'i' } })
            .then(transport => res.json({ transport } ))
            .catch(() => res.json({ message: `no transport` }))

    })

module.exports = router