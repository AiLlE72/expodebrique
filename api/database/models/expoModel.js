const mongoose = require('mongoose')
const depmodel = require('./depModel')



const expoSchema = new mongoose.Schema({
    name: String,
    adress: String,
    city: String,
    departement: { type: mongoose.Schema.Types.ObjectId, ref: depmodel },
    postCode: String,
    country: String,
    startDate: Date,
    endDate: Date,
    fullimage: String,
    fullaffiche: String,
    lowimage: String,
    lowaffiche: String,
    horaire: String,
    price: String,
    contact: String,
    search: Boolean,
    author: {
        type: String,
        default: 'noAuthor'
    },
})

module.exports = mongoose.model('expocollection', expoSchema)