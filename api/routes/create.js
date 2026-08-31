import express from 'express'
const router = express.Router()
import cors from 'cors'
import { pb } from '../../db/pocketbase.js'
import {
    hashPWD
} from '../encrypting.js'

router.use(express.json())
router.use(cors({
    origin: '*'
}))

router.post('/create-new-family-user/:id', async (req, res) => {
    try {
        const family = await pb.collection('families').getOne(req.params.id)
        const familyUsers = Array.isArray(family.familyUsers) ? family.familyUsers : []
        familyUsers.push(req.body.user)
        await pb.collection('families').update(req.params.id, {
            familyUsers
        })
        res.json({
            "status": true
        })
    } catch (err) {
        console.log(err)
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
            try {
                const family = await pb.collection('families').create({
                    familyEmail: req.body.email,
                    familyPassword: password,
                    familyUsers: []
                })
                res.json({
                    "status": "savedCorrectly",
                    id: family.id
                })
                return
            } catch (err) {
                console.log(err)
                res.json({
                    "status": "errorSavingGrocery"
                })
                return
            }
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
    try {
        await pb.collection('groceries').create({
            family: req.params.id,
            createdOn: date.toLocaleDateString(),
            appendedBy: req.body.appendedBy,
            grocery_item_name: req.body.comida,
            cuantity: req.body.cuantity
        })
        res.json({
            status: true
        })
    } catch (err) {
        console.log(err)
        res.json({
            status: false
        })
    }
})

router.post('/update/:id', async (req, res) => {
    var date = new Date();
    try {
        await pb.collection('groceries').delete(req.body.id)
    } catch (err) {
        console.log(err)
    }
    try {
        await pb.collection('groceries').create({
            family: req.params.id,
            grocery_item_name: req.body.item,
            cuantity: req.body.cuantity,
            createdOn: date.toLocaleDateString(),
            appendedBy: req.body.appendedBy
        })
        res.json({
            status: true
        })
    } catch (err) {
        console.log(err)
        res.json({
            status: false
        })
    }
})

export {
    router
}
