
const express = require('express')
const router = express.Router()

const BOOK = require('../../models/book.model')
const TARIFF = require('../../models/tariff.model')
const TRANSPORT = require('../../models/transport.model')
const USER = require('../../models/user.model')


const moment = require('moment')

const authenticateToken = require('./helpers')

router
    //get all books
    .get('/', authenticateToken, async (req, res) => {

        const books = await BOOK.find({})

        res.json({ books })

    })
    //add new book
    .post('/', authenticateToken, async (req, res) => {

        const transport_id = req.body.transport_id
        const user_id = req.body.user_id
        const tariff_id = req.body.tariff_id
        const book_start = moment(new Date(req.body.book_start))

        //const book_end = req.body.book_end

        //console.log(moment(new Date(Date.now())))

        const now = await moment(new Date(Date.now()))

        console.log(now, book_start)

        if(moment(now).isAfter(book_start)) return res.json({ error : `you can't make booking in past` })

        //find transport by id

        const transport = await TRANSPORT.findById(transport_id)

        const books = await BOOK.find({ transport_id: transport_id })

        const tariff = await TARIFF.findById(tariff_id)

        const user = await USER.findById(user_id)

        if(user && user.user_role !== 'client') return res.json({ error: `you must be a client` })

        if(!transport) return res.json({ error : `transport not found` })

        //check if transport is blocked

        if(transport && transport.transport_status === 'blocked') return res.json({ error : `transport is blocked` })

        //check transport id schedule is transport is busy

        if(!tariff) return res.json({ error : `no such tariff` })

        //check if user banned

        if(user && user.user_status === 'banned') return res.json({ error: `user is banned` })

        //get tariff length

        const tariff_length = tariff.tariff_length

        //add tariff approx end

        const tariff_approx_end = moment(new Date(book_start)).add(tariff_length, 'minutes')

        //check for past time



        //optimize schedule check

        let scheduleChecker = true

        books.map(book => {

            if( moment(book_start).isBetween(book.book_start, book.book_end) ||
                moment(tariff_approx_end).isBetween(book.book_start, book.book_end)){
                scheduleChecker = false;
            }

        })
        
        if(!scheduleChecker) return res.json({ error : `schedule busy` })

        //make new book item

        const book = new BOOK({
            transport_id : transport_id,
            user_id : user_id,
            tariff_id : tariff_id,
            book_start : book_start,
            book_end : tariff_approx_end,
        })

        await book.save()
            .then(r => res.json({ message : `book added`, r }))
            .catch(e => res.json({ error : e }))

    })
    //delete booking
    .delete('/:book_id', authenticateToken, async (req, res) => {

        const book_id = req.params.book_id

        await BOOK.findByIdAndDelete(book_id)
            .then(() => res.json({ message: `deleted` }))
            .catch(e => res.json({ error: e }))
    })
    //add user rating increase
    .patch('/rate/add/:book_id', authenticateToken, async (req, res) => {

        const book_id = req.params.book_id

        const rating  = req.body.user_rating

        const book = await BOOK.findById(book_id)

        if(!book) return res.json({ error : `no such book` })

        const user_id = book.user_id

        const user = await USER.findById(user_id)

        const us_rating = user.user_rating

        await USER.findByIdAndUpdate(user_id, {
            user_rating: us_rating + rating
        })
            .then(() => res.json({ message : `updated` }))
            .catch(e => res.json({ error: e }))
    })
    //add user rating decrease
    .patch('/rate/min/:book_id', authenticateToken, async (req, res) => {

        const book_id = req.params.book_id

        const rating  = req.body.user_rating

        const book = await BOOK.findById(book_id)

        if(!book) return res.json({ error : `no such book` })

        const user_id = book.user_id

        const user = await USER.findById(user_id)

        const us_rating = user.user_rating

        await USER.findByIdAndUpdate(user_id, {
            user_rating: us_rating - rating
        })
            .then(() => res.json({ message : `updated` }))
            .catch(e => res.json({ error: e }))
    })
    //get history by point id
    .get('/history/:point_id', authenticateToken, async(req, res) => {

        const point_id = req.params.point_id

        const transports = await TRANSPORT.find({
            point_id: point_id,
        })

        if(!transports) return res.json({ error: `no transport` })

        const books = await BOOK.find({})

        if(!books) return res.json({ error: `no books` })

        let result = []

        for(transport of transports){
            for(book of books){
                if(`${transport._id}` === `${book.transport_id}`){
                    result.push(book)
                }
            }
        }

        res.json({ result })

    })

module.exports = router