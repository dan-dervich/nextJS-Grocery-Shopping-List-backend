import mongoose from 'mongoose';

const connect = async () => {
    try {
        await mongoose.connect('mongodb://uhgadps8czlfzbpovalo:Rm2DDVlJMdIyzFKf8sPd@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bfpqubni11nmfa0?replicaSet=rs0', {
            'useNewUrlParser': true,
            'useUnifiedTopology': true
        })
        console.log('database connected sucessfuly');
    } catch (err) {
        console.log(err)
    }
}

export default connect