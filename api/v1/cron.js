const cron = require('node-cron')

const moment = require('moment')

const BOOK = require('../../models/book.model')

const TARIFF = require('../../models/tariff.model')
const TRANSPORT = require('../../models/transport.model')
const USER = require('../../models/user.model')

const task = cron.schedule("* * * * * *", async () => {

    const bookings = await BOOK.find({
        book_status : `active`
    })

    if(bookings && bookings.length){
        const date = await moment(new Date(Date.now()))

        for(const b of bookings){

            const end_tariff = await moment(b.book_end)


            if(moment(date).isAfter(end_tariff)){

                await BOOK.findByIdAndUpdate( b._id,
                    { book_status: 'done' })
                    .then(() => console.log({ message: `tariff ${b._id} is done now !` }))
                    .catch(e => console.log(e))

            }

        }

    }



}, {})

module.exports = task