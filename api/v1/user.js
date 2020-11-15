const express = require('express')
const router = express.Router()

const USER = require('../../models/user.model')
const jwt = require("jsonwebtoken");
const bCrypt = require('bcrypt')

const authenticateToken = require('./helpers')

router
    //login route
    .post('/login', async (req, res) => {

        const user_email = req.body.user_email;
        const user_password = req.body.user_password;

        const user = await USER.findOne({
            user_email,
            user_password
        })

        if (!user) {
            return res.sendStatus(404)
        } else {

            const { user_email, _id } = user
            const access_token = jwt.sign({ user_email, _id }, process.env.TOKEN_SECRET);

            res.json({ user_email, _id, access_token })

        }

    })
    //getting list of all users
    .get('/', authenticateToken, async (req, res) => {

        USER.find({})
            .then((data) => {
                data.length ? res.json(data) : res.json({ message: `no users` })
            })
            .catch((err) => {
                res.json({
                    error: err
                })
            })

    })
    //finding user by user_id
    .get('/find', authenticateToken, async (req, res) => {

        const user = await USER.findOne({
            _id: req.body.user_id
        })

        if(!user) {
            return res.json({
                message: `no users found with provided credentials`
            })
        }

        return res.json({ user })

    })
    //adding new user
    .post('/', authenticateToken, async (req, res) => {

        //register

        const newUser = new USER({
            user_name: req.body.user_name,
            user_middle_name: req.body.user_middle_name,
            user_last_name: req.body.user_last_name,
            user_phone: req.body.user_phone,
            user_email: req.body.user_email,
            user_password:  req.body.user_password,
            user_id_number: req.body.user_id_number,
            user_address: req.body.user_address,
            user_city_registered: req.body.user_city_registered,
        })
        await newUser.save()
            .then(() => res.json({message: `user added`}))
            .catch(err => res.json({ error: err }))

    })
    //blocking user by user_id
    .patch('/block', authenticateToken, async (req, res) =>{

        const user = await USER.findById(req.body.user_id)

        if(!user) return res.json({ message: `no users found with provided credentials` })

        user.user_status = 'banned'

        await user.save()
            .then(() => res.json({ message : `user banned` }))
            .catch((err) => res.json({ error : err }))

    })
    //unblocking user by user_id
    .patch('/unblock', authenticateToken, async (req, res) =>{

        const user = await USER.findById(req.body.user_id)

        if(!user) return res.json({ message: `no users found with provided credentials` })

        user.user_status = 'active'

        await user.save()
            .then(() => res.json({ message : `user unbanned` }))
            .catch((err) => res.json({ error : err }))

    })
    //deleting user by user_id
    .delete('/delete', authenticateToken, async (req, res) => {

        const user = await USER.findById(req.body.user_id)

        if(!user) {
            return res.json({ message: `no users found with provided credentials` })
        } else{

            await USER.deleteOne({ _id: req.body.user_id })
                .then(() => res.json({ message : `user deleted` }))
                .catch((err) => res.json({ error : err }))

        }
    })
    //get autocomplete for searching by phone number
    .get('/autocomplete/:user_phone', authenticateToken, async (req, res) => {

        const user_phone = req.params.user_phone

        await USER.find({ user_phone: { $regex: `${user_phone}` } })
            .then(users => res.json({ users } ))
            .catch(() => res.json({ message: `no users` }))

    })

module.exports = router