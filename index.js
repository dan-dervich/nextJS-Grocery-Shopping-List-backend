import express from 'express'
const app = express()
import morgan from 'morgan'
import cors from 'cors'
import {
    router as createRoute
} from './api/routes/create.js'
import {
    router as authRouter
} from './api/routes/auth.js'
import {
    router as readRouter
} from './api/routes/read.js'
import {
    router as deleteRouter
} from './api/routes/delete.js'
import nodemailer from 'nodemailer'
const logger = morgan


app.use(logger('dev'))
app.use(cors({
    origin: '*'
}))
app.use(express.json())
app.use('/auth', authRouter)
app.use('/c', createRoute)
app.use('/r', readRouter)
app.use('/d', deleteRouter)


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


app.get('/', (req, res) => {
    res.json({
        status: "everything should be working fine : )"
    })
})

app.post('/feedback', async (req, res)=>{
    let mail = {
        from: 'juanchodelarosa11173663@gmail.com',
        to: 'dandervich@gmail.com',
        subject: 'Error in groceries app',
        body: `Hey Dan, you gotta fix an error in the sign-up/login page. the error their getting is: ${req.body.feedback}. <br /> error detected by: ${req.body.email}`
    }
    sendEmail(mail, res)
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));