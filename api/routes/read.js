import express from 'express'
const router = express.Router()
import cors from 'cors'
import Groceries from '../../db/groceriesModel.js'

router.use(express.json())
router.use(cors({
    origin: '*'
}))

router.get('/all-groceries/:id', async (req, res) => {
    const docs = await Groceries.findOne({
        "_id": req.params.id
    })
    const {
        groceries
    } = docs
    const id = docs._id
    res.json({
        groceries,
        id
    })
})


router.get('/users/:id', async (req, res) => {
    const docs = await Groceries.findOne({
        "_id": req.params.id
    })
    const users = docs.familyUsers
    res.json({
        users: users
    })
})


export {
    router
}