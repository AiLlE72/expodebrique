const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    firstname:  String,
    lastname: String,
    email: String,
    departement: Number,
    pays: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBan: {
        type: Boolean,
        default: false,
    },
    createDate : {
        type: Date,
        default : new Date()
    },
    exposant: String,
    organisateur: String,
    newsAcceptExpositionLocation: String,
    newsAcceptExposant: String,
    newsAcceptExposition: String
})

userSchema.pre('save', function ( next ) {
    const user = this
    bcrypt.hash(user.password, 10, (err, encrypted) => {
        user.password = encrypted
        next()
    })

})


module.exports = mongoose.model('usercollection', userSchema)