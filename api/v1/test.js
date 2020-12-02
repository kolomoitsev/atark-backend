const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')

router

    //get all transport
    .get('/sync/:secret',(req, res) => {
        const word = req.params.secret
        let hashed = bcrypt.hashSync(word, 10)
        return res.json({hashed})

    })
    .get('/async/:secret',async (req, res) => {
        const word = req.params.secret
        let hashed = await bcrypt.hash(word, 10)
        return res.json({hashed})

    })

module.exports = router