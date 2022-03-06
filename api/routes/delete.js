import express from 'express'
const router = express.Router()
import cors from 'cors'
import Groceries from '../../db/groceriesModel.js'

router.use(express.json())
router.use(cors({
    origin: '*'
}))

router.get('/grocery/:id', async (req, res) => {
    const docs = await Groceries.updateOne({
        "groceries._id": req.params.id
    }, {
        $pull: {
            groceries: {
                "_id": req.params.id
            }
        }
    })
    const {
        acknowledged,
        modifiedCount,
        matchedCount
    } = docs
    if (acknowledged == true && modifiedCount > 0 && matchedCount > 0) {
        res.json({"status": true})
    } else{
        res.json({"status": false})
    }
})

export {
    router
}