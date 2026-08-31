import express from 'express'
const router = express.Router()
import cors from 'cors'
import { pb } from '../../db/pocketbase.js'

router.use(express.json())
router.use(cors({
    origin: '*'
}))

router.get('/all-groceries/:id', async (req, res) => {
    try {
        const family = await pb.collection('families').getOne(req.params.id)
        const groceries = await pb.collection('groceries').getFullList({
            filter: pb.filter('family = {:id}', { id: req.params.id }),
            sort: 'created'
        })
        res.json({
            groceries,
            id: family.id
        })
    } catch (err) {
        console.log(err)
        res.json({
            groceries: [],
            id: null
        })
    }
})


router.get('/users/:id', async (req, res) => {
    try {
        const family = await pb.collection('families').getOne(req.params.id)
        res.json({
            users: family.familyUsers || []
        })
    } catch (err) {
        console.log(err)
        res.json({
            users: []
        })
    }
})


export {
    router
}
