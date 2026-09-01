import express from 'express'
const router = express.Router()
import cors from 'cors'
import { pb } from '../../db/pocketbase.js'

router.use(express.json())
router.use(cors({
    origin: '*'
}))

router.get('/grocery/:id', async (req, res) => {
    try {
        await pb.collection('groceries').delete(req.params.id)
        res.json({
            "status": true
        })
    } catch (err) {
        console.log(err)
        res.json({
            "status": false
        })
    }
})

router.post('/family-user/:id', async (req, res) => {
    try {
        const family = await pb.collection('families').getOne(req.params.id)
        const familyUsers = Array.isArray(family.familyUsers) ? family.familyUsers : []
        const updatedUsers = familyUsers.filter((user) => user !== req.body.user)
        await pb.collection('families').update(req.params.id, {
            familyUsers: updatedUsers
        })
        res.json({
            "status": true
        })
    } catch (err) {
        console.log(err)
        res.json({
            "status": false
        })
    }
})

export {
    router
}
