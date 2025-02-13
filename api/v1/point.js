const express = require('express')
const router = express.Router()

const POINT = require('../../models/point.model')
const USER = require('../../models/user.model')
const POINT_WORKER = require('../../models/pointworker.model')

const authenticateToken = require('./helpers')

router
    //get points all
    .get('/', authenticateToken, async (req, res) => {

        await POINT.find({})
            .then(points => res.json(points))
            .catch(err => res.json({ message: err }))

    })
    .get('/owner/:owner_id', authenticateToken, async (req, res) => {

        await POINT.find({
            user_id: req.params.owner_id
        })
            .then(points => res.json(points))
            .catch(err => res.json({ message: err }))

    })
    //get points by city id
    .get('/:city_id', authenticateToken, async (req, res) => {

        const city_id = req.params.city_id

        await POINT.find({ city_id: city_id })
            .then(points => res.json(points))
            .catch(err => res.json({ message : err }))

    })
    //add point
    .post('/', authenticateToken, async (req, res) => {

        const city_id = req.body.city_id
        const point_name = req.body.point_name;
        const user_id = req.body.user_id;

        const user = await USER.findById(user_id)

        if(user && user.user_status === 'banned') return res.json({ error : `banned users can't make any points` })

        if(user && user.user_role !== 'owner') return res.json({ error : `you must have chosen another role` })

        const point =  new POINT({
            city_id: city_id,
            point_name: point_name,
            user_id: user_id
        })

        await point.save()
            .then(() => res.json({ message: `point added` }))
            .catch(err => res.json({ error: err }))

    })
    //edit point
    .patch('/', authenticateToken, async (req, res) => {

        const point_id = req.body.point_id;
        const city_id  = req.body.city_id;
        const point_name = req.body.point_name;

        await POINT.findByIdAndUpdate(point_id, {
            city_id : city_id,
            point_name: point_name
        })
            .then(() => res.json({ message : `updated`}))
            .catch(err => res.json({ error : err }))
    })
    //add point workers
    .post('/worker', authenticateToken, async (req, res) =>{

        const point_id = req.body.point_id;

        const user_id = req.body.user_id;

        //find if user is admin anywhere

        const user = await USER.findById(user_id)

        console.log(user && user.user_role)

        if(user && user.user_role !== 'worker') return res.json({ error: `user's role isn't a worker` })

        const owner = await POINT.find({ owner_id : user_id })

        if(owner && owner.length) return res.json({ error : `user ia an owner somewhere currently` })

        const worker = await POINT_WORKER.find({ user_id : user_id, point_worker_status : 'active' })

        if(worker && worker.length) return res.json({ error : `user has a job currently` })


        const pointWorker = new POINT_WORKER({
            point_id: point_id,
            user_id: user_id,
        })

        await pointWorker.save()
            .then(() => res.json( { message : `worker added`} ))
            .catch( (err) => res.json({ error: err }))
    })
    //get list of workers
    .get('/list/:point_id', authenticateToken, async (req, res) => {

        const point_id  = req.params.point_id

        const workers = await POINT_WORKER.find({ point_id: point_id })

        res.json({ workers })

    })
    //delete worker
    .delete('/worker', authenticateToken, async (req, res) => {

        const point_id = req.body.point_id
        const point_owner_id = req.body.point_owner_id
        const user_id = req.body.user_id;

        const point = await POINT.find({
            _id : point_id,
            user_id: point_owner_id
        })

        if(point && !point.length) return res.json({ error: `you must be an owner to delete a worker` })

        await POINT_WORKER.findOneAndUpdate({
            point_id : point_id,
            user_id : user_id,
            point_worker_status : `active`,
        }, {
            point_worker_status : `deleted`,
        })
            .then(() => res.json({ message : `work place deleted` }))
            .catch(err => res.json({ error : err }))

    })
    //change point owner
    .patch('/owner', authenticateToken, async (req, res) => {

        const point_id = req.body.point_id;
        const user_id = req.body.user_id;

        //check if user is an owner anywhere else

        const owner = await POINT.find({ owner_id : user_id })

        if(owner && owner.length) return res.json({ error : `user ia an owner somewhere currently` })

        //check if user working anywhere

        const worker = await POINT_WORKER.find({ user_id : user_id, point_worker_status : 'active' })

        if(worker && worker.length) return res.json({ error : `user has a job currently` })

        // -> set new owner

        await POINT.findByIdAndUpdate(point_id, { owner_id : user_id })
            .then(() => res.json({ message: `point owner updated` }))
            .catch((err) => res.json({ error: err }))
    })
    //get points autocomplete from all available
    .get('/autocomplete/:point_name', authenticateToken, async (req, res) => {

        const point_name = req.params.point_name

        await POINT.find({ point_name: { $regex: `${point_name}`, $options: 'i' } })
            .then(points => res.json({ points } ))
            .catch(() => res.json({ message: `no points` }))

    })
    //delete point
    .delete('/:point_id', authenticateToken, async (req, res) => {

        const point_id = req.params.point_id;

        const user_id = req.body.user_id;


        const point = await POINT.findById(point_id)
        const user = await USER.findById(user_id)

        if( point.user_id !== user._id ) return res.json({ error : `you are not the owner of the point` })


        await POINT.findByIdAndDelete(point_id)
            .then(() => res.json({ message: `point deleted` }))
            .catch(err => res.json({ error: err }))

    })



module.exports = router