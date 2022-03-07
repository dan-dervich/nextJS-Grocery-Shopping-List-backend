import mongoose from 'mongoose';

const connect = async () => {
    try {
        await mongoose.connect('mongodb://uhgadps8czlfzbpovalo:Rm2DDVlJMdIyzFKf8sPd@bfpqubni11nmfa0-mongodb.services.clever-cloud.com:27017/bfpqubni11nmfa0', {
            'useNewUrlParser': true,
            'useUnifiedTopology': true
        })
        console.log('database connected sucessfuly');
    } catch (err) {
        console.log(err)
    }
}

export default connect