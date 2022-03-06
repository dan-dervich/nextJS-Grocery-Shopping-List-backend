import express from 'express'
import cors from 'cors'
import {
    comparePWD,
    hashPWD
} from '../encrypting.js'
import Groceries from '../../db/groceriesModel.js'
import nodemailer from 'nodemailer'

const router = express.Router()

router.use(express.json())
router.use(cors({
    origin: "*"
}))


const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "juanchodelarosa11173663@gmail.com",
        pass: 'itrlwghkrunawqtj'
    }
})

function sendEmail(mail, res) {
    var mailOptions = {
        from: mail.from,
        to: mail.to,
        replyTo: null,
        subject: mail.subject,
        html: `${mail.body}`,
    }
    transport.sendMail(mailOptions, (err, info) => {
        console.log(info)
        if (err) {
            console.log(err)
            res.json({
                "status": false
            })
        } else {
            res.json({
                "status": true
            })
        }
    })
}


router.post("/login", async (req, res) => {
    if (req.body.password) {
        if (req.body.email) {
            console.log(req.body.email)
            const docs = await Groceries.findOne({
                familyEmail: req.body.email
            })
            console.log(docs)
            if (docs == null) {
                res.json({
                    "status": "noUserWithThatEmailOrPassword"
                })
            } else {
                const compare = await comparePWD(req.body.password, docs.familyPassword)
                if (compare == true) {
                    res.json({
                        "status": "everythingIsOk",
                        id: docs._id
                    })
                } else {
                    res.json({
                        "status": "wrongPassword"
                    })
                }
            }
        } else {
            res.json({
                "status": "errorWithInput"
            })
        }
    } else {
        res.json({
            "status": "errorWithInput"
        })
    }
})


router.post('/forgotPWD', async (req, res) => {
    if (req.body.email) {
        const docs = await Groceries.findOne({
            familyEmail: req.body.email
        })
        if (docs.familyEmail == req.body.email) {
            let mail = {
                from: 'juanchodelarosa11173663@gmail.com',
                to: req.body.email,
                subject: 'Olvide Mi Contraseña',
                body: `<h1>Restablecer Contraseña:</h1> <br> <h4><a href="https://next-js-grocery-shopping-list.vercel.app//auth/forgotPWD/${docs._id}">Restablecer</a></h4> Puedes restablecer tu contraseña con el link de arriba o copiar este link: https://next-js-grocery-shopping-list.vercel.app//auth/forgotPassword/${docs._id}`
            }
            sendEmail(mail, res)
        }
    }
})

router.post('/forgotPWD/:id', async (req, res) => {
    if (req.body.password) {
        const pwd = await hashPWD(req.body.password)
        const docs = await Groceries.updateOne({
            "_id": req.params.id
        }, {
            $set: {
                familyPassword: pwd
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
                errorMessage: "errorSettingPassword"
            })
        }
    } else {
        res.json({
            "status": false,
            errorMessage: "noPasswordSentToBackend"
        })
    }
})


router.get('/check-user/:id', async (req, res) => {
    const docs = await Groceries.findOne({
        "_id": req.params.id
    })
    if (docs !== null) {
        //* success
        res.json({
            "status": "success"
        })
    } else {
        //! error
        res.json({
            "status": "error"
        })
    }
})


export {
    router
}