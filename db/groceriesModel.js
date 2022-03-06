import mongoose from 'mongoose'
import connect from './db.js'

connect()
const {
    Schema
} = mongoose



const schema = new Schema({
    familyEmail: {
        type: String,
        unique: true,
        index: true
    },
    familyPassword: String,
    familyUsers: [],
    groceries: [{
        createdOn: String,
        appendedBy: String,
        grocery_item_name: String,
        cuantity: String,
    }]
})
// const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Groceries = mongoose.models.Groceries || mongoose.model('Groceries', schema)

export default Groceries