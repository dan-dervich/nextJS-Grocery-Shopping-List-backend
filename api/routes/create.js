import express from 'express'
const router = express.Router()
import cors from 'cors'
import Groceries from '../../db/groceriesModel.js'
import {
    hashPWD
} from '../encrypting.js'

router.use(express.json())
router.use(cors({
    origin: '*'
}))

router.post('/create-new-family-user/:id', async (req, res) => {
    const docs = await Groceries.updateOne({
        "_id": req.params.id
    }, {
        $addToSet: {
            familyUsers: [req.body.user]
        }
    })
    const {
        acknowledged,
        modifiedCount,
        matchedCount
    } = docs
    if (acknowledged == true && modifiedCount > 0 && matchedCount > 0) {
        res.json({
            "status": true
        })
    } else {
        res.json({
            "status": false,
            errorMessage: "errorSavingUser"
        })
    }
})

router.post('/new-user', async (req, res) => {
    if (req.body.email.length > 0) {
        if (req.body.password.length > 0) {
            const password = await hashPWD(req.body.password)
            if (password == false) {
                res.json({
                    "status": "errorHashing"
                })
                return
            }
            const docs = new Groceries({
                familyEmail: req.body.email,
                familyPassword: password
            })
            docs.save((err, grocery) => {
                if (err) {
                    res.json({
                        "status": "errorSavingGrocery"
                    })
                    return
                } else {
                    res.json({
                        "status": "savedCorrectly",
                        id: grocery._id
                    })
                    return
                }
            })
        } else {
            res.json({
                "status": "noPasswordSentToBackend"
            })
            return
        }
    } else {
        res.json({
            "status": "noEmailSentToBackend"
        })
        return
    }
})

router.post('/grocery/:id', async (req, res) => {
    var date = new Date();
    const docs = await Groceries.updateOne({
        "_id": req.params.id
    }, {
        $addToSet: {
            groceries: [{
                createdOn: date.toLocaleDateString(),
                appendedBy: req.body.appendedBy,
                grocery_item_name: req.body.comida,
                cuantity: req.body.cuantity
            }]
        }
    })
    const {
        acknowledged,
        modifiedCount,
        matchedCount
    } = docs
    if (acknowledged == true && modifiedCount > 0 && matchedCount > 0) {
        res.json({
            status: true
        })
    }
})

router.post('/update/:id', async (req, res) => {
    var date = new Date();
    const docs1 = await Groceries.updateOne({
        "groceries._id": req.body.id
    }, {
        $pull: {
            groceries: {
                "_id": req.body.id
            }
        }
    })
    console.log(docs1)
    const docs = await Groceries.updateOne({
        "_id": req.params.id
    }, {
        $addToSet: {
            groceries: {
                grocery_item_name: req.body.item,
                cuantity: req.body.cuantity,
                createdOn: date.toLocaleDateString(),
                appendedBy: req.body.appendedBy
            }
        }
    })
    console.log(docs)
    const {
        acknowledged,
        modifiedCount,
        matchedCount
    } = docs
    if (acknowledged == true && modifiedCount > 0 && matchedCount > 0) {
        res.json({
            status: true
        })
    }   
})

export {
    router
}