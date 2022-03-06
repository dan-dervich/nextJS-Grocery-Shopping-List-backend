import mongoose from 'mongoose';
import { } from 'dotenv/config'

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, {
            'useNewUrlParser': true,
            'useUnifiedTopology': true
        })
        console.log('database connected sucessfuly');
    } catch (err) {
        console.log(err)
    }
}

export default connect