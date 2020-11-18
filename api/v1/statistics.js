const express = require('express')
const router = express.Router()

const BOOK = require('../../models/book.model')
const TARIFF = require('../../models/tariff.model')
const TRANSPORT = require('../../models/transport.model')

const USER = require('../../models/user.model')

const moment = require('moment')

const authenticateToken = require('./helpers')

router

    //statistics by user
    .get('/user/:user_id', authenticateToken, async(req, res) => {


        const user_id = req.params.user_id

        let money_total = 0;
        let time_total = 0;
        let rides_total = 0;

        const books = await BOOK.find({
            user_id: user_id,
        })

        if(books && !books.length) return res.json({ error: `no booking found with this user` })

        rides_total = books.length

        for(const book of books){
            //get time

            const time_start =  await moment(book.book_start)
            const time_end =  await moment(book.book_end)

            time_total += await(time_end.diff(time_start, "minutes"))

            //get money

            const tariff_id = book.tariff_id
            const tariff = await TARIFF.findById(tariff_id)

            money_total += Number(tariff.tariff_price.split(' ')[0])

        }

        res.json({ books, time_total, money_total, rides_total })

    })
    //statistics by transport wheel
    .get('/transport/:transport_id', authenticateToken, async (req, res) => {

        const transport_id = req.params.transport_id

        let money_total = 0;
        let time_total = 0;
        let rides_total = 0;

        const books = await BOOK.find({
            transport_id: transport_id,
        });

        if(books && !books.length) return res.json({ error : `no booking with such transport` })

        for (const book of books) {

            //get time

            const time_start = await moment(book.book_start);
            const time_end = await moment(book.book_end);

            time_total += await (time_end.diff(time_start, "minutes"));

            //get money

            const tariff_id = book.tariff_id;
            const tariff = await TARIFF.findById(tariff_id);

            money_total += Number(tariff.tariff_price.split(' ')[0]);

        }

        //get total rides on transport_id

        rides_total = books.length

        res.json({ time_total, money_total, rides_total })

    })
    //statistics by rent point
    .get('/point/:point_id', authenticateToken, async (req, res) => {

        const point_id = req.params.point_id

        const transport = await TRANSPORT.find({
            point_id: point_id,
        })

        let money_total = 0;
        let time_total = 0;
        let rides_total = 0;

        if(transport && !transport.length) return res.json({ error: `no transport found` })

        for(const item of transport){

            //get total rides on point

            const bookings = await BOOK.find({
                transport_id: item._id,
            });

            rides_total += bookings.length

            //get money spend on one point

            if(bookings && bookings.length){

                for(const b of bookings){

                    const tariff_id = b.tariff_id;
                    const tariff = await TARIFF.findById(tariff_id);

                    const time_start = await moment(b.book_start);
                    const time_end = await moment(b.book_end);

                    money_total += Number(tariff.tariff_price.split(' ')[0]);

                    time_total += await (time_end.diff(time_start, "minutes"));

                }

            }

        }

        res.json({rides_total, money_total, time_total})

    })


module.exports = router