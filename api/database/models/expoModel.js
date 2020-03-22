const mongoose = require('mongoose')
const depmodel = require('./depModel')



const expoSchema = new mongoose.Schema({

    name: String,
    adress: String,
    city: String,
    departement: { type : mongoose.Schema.Types.ObjectId, ref:depmodel},
    postCode: String,
    country: String,
    startDate: Date,
    endDate: Date,
    image: String,
    affiche: String,
    horaire: String,
    price: String,
    contact: String,
    search: Boolean,
    author: String
})




module.exports = mongoose.model('expocollection', expoSchema)