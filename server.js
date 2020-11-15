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

app.use('/api/v1/book', BOOK_API)
app.use('/api/v1/user', USER_API)
app.use('/api/v1/transport', TRANSPORT_API)
app.use('/api/v1/country', COUNTRY_API)
app.use('/api/v1/city', CITY_API)
app.use('/api/v1/category', CATEGORY_API)
app.use('/api/v1/point', POINT_API)
app.use('/api/v1/tariff', TARIFF_API)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
