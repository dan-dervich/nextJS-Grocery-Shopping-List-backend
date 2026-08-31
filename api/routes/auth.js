import express from 'express'
import cors from 'cors'
import {
    comparePWD,
    hashPWD
} from '../encrypting.js'
import { pb } from '../../db/pocketbase.js'
import nodemailer from 'nodemailer'

const router = express.Router()

router.use(express.json())
router.use(cors({
    origin: "*"
}))
const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "holacomomteva@gmail.com",
    pass: "zzqdlbddnxxzmwun",
  },
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
            let docs
            try {
                docs = await pb.collection('families').getFirstListItem(
                    pb.filter('familyEmail = {:email}', { email: req.body.email })
                )
            } catch (err) {
                console.log(err)
                docs = null
            }
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
                        id: docs.id
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
        let docs
        try {
            docs = await pb.collection('families').getFirstListItem(
                pb.filter('familyEmail = {:email}', { email: req.body.email })
            )
        } catch (err) {
            console.log(err)
            docs = null
        }
        if (docs !== null && docs.familyEmail == req.body.email) {
            let mail = {
                from: 'dandervich@gmail.com',
                to: req.body.email,
                subject: 'Olvide Mi Contraseña',
                text: 'restablecer tu contraseña',
                body: `<h1>Restablecer Contraseña:</h1> <br> <h4><a href="https://next-js-grocery-shopping-list.vercel.app//auth/forgotPWD/${docs.id}">Restablecer</a></h4> Puedes restablecer tu contraseña con el link de arriba o copiar este link: https://next-js-grocery-shopping-list.vercel.app//auth/forgotPassword/${docs.id}`
            }
            sendEmail(mail, res)
        }
    }
})

router.post('/forgotPWD/:id', async (req, res) => {
    if (req.body.password) {
        const pwd = await hashPWD(req.body.password)
        try {
            await pb.collection('families').update(req.params.id, {
                familyPassword: pwd
            })
            res.json({
                "status": true
            })
        } catch (err) {
            console.log(err)
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
    try {
        await pb.collection('families').getOne(req.params.id)
        //* success
        res.json({
            "status": "success"
        })
    } catch (err) {
        //! error
        console.log(err)
        res.json({
            "status": "error"
        })
    }
})


export {
    router
}
