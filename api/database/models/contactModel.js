const mongoose = require('mongoose')


const contactSchema = new mongoose.Schema({

    name: String,
    email: String,
    sujet: String, 
    message: String,
    sendDate : {
        type: Date,
        default : new Date()
    },
    
})

module.exports = mongoose.model('contactcollection', contactSchema)