const express = require('express')
const router = express.Router()

router
    .get('/', (req, res) => {
        res.json({
            message: `book get`
        })
    })
    .post('/', (req, res) => {})
    .put('/', (req, res) => {})
    .delete('/', (req, res) => {})

module.exports = router