const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');


require('dotenv').config()

const MONGODB_LINK = process.env.MONGODB

mongoose.connect(MONGODB_LINK, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log(`MongoDb connection established successfully`);
});

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const BOOK_API = require('./api/v1/book')
const USER_API = require('./api/v1/user')
const TRANSPORT_API = require('./api/v1/transport')
const COUNTRY_API = require('./api/v1/country')
const CITY_API = require('./api/v1/city')
const CATEGORY_API = require('./api/v1/category')
const POINT_API = require('./api/v1/point')
const TARIFF_API = require('./api/v1/tariff')
const INFO_API = require('./api/v1/info')
const STATISTICS_API = require('./api/v1/statistics')

const TEST_API = require('./api/v1/test')

app.use('/api/v1/book', BOOK_API)
app.use('/api/v1/user', USER_API)
app.use('/api/v1/transport', TRANSPORT_API)
app.use('/api/v1/country', COUNTRY_API)
app.use('/api/v1/city', CITY_API)
app.use('/api/v1/category', CATEGORY_API)
app.use('/api/v1/point', POINT_API)
app.use('/api/v1/tariff', TARIFF_API)
app.use('/api/v1/info', INFO_API)
app.use('/api/v1/statistic', STATISTICS_API)

app.use('/api/v1/test', TEST_API)

require('./api/v1/cron') // CRON FOR BACKEND

const PORT = process.env.PORT || 3000

server = app.listen(PORT, () => console.log(`server running on port ${PORT}`))

const socketio = require('socket.io')

const io = socketio(server);

const { addUser, removeUser, getUser, getUsersInRoom } = require('./api/v1/chat')

io.on('connection', (socket) => {

    // console.log('we have a new connection');

    socket.on('join', ({ uid, roomId }, callback) => {


        const { error, user }  = addUser({ userId: uid, roomId: roomId })


        if(error) callback({ error : 'error' })

        // socket.emit('message', {  user: 'admin', text: `${user.userId} Welcome to the room` })
        //
        // socket.broadcast.to(user.roomId).emit('message', { user: 'admin', text: `${ user.userId }, has joined` })

        socket.join(user.roomId)

    })

    socket.on('sendMessage', ({ roomID, userID, message, sendAt }, callback) => {


        const user = getUser({ id: userID, room: roomID })

        // console.log( roomID, userID, message )

        io.to(user.roomId).emit('message', { user: user.userId, message: message, roomID: user.roomId, sendAt: sendAt })

        console.log(`message sent to ${ user.roomId }`)

        callback({ error: 'message sent' });

    })

    socket.on('disconnect', () => {
        // console.log('user had left! ')
    })

})
