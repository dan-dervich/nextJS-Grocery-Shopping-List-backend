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


app.get('/', (req, res) => {
    res.json({
        status: "everything should be working fine : )"
    })
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));