const mongoose = require('mongoose')


const oldUserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    archiveDate: {
        type: Date,
        default : new Date()
    }
    
})

module.exports = mongoose.model('oldusercollection', oldUserSchema)