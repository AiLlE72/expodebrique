const mongoose = require('mongoose')


const depSchema = new mongoose.Schema({
    region_code: String,
    code: String,
    name: String,
    slug: String
   
})

module.exports = mongoose.model('depcollection', depSchema)