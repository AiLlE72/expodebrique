const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const depmodel = require('./depModel')

const userSchema = new mongoose.Schema({

    firstname: String,
    lastname: String,
    email: String,
    departement: { type: mongoose.Schema.Types.ObjectId, ref: depmodel },
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
    createDate: {
        type: Date,
        default: new Date()
    },
    exposant: {
        type: String,
        default: 'off'
    },
    organisateur: {
        type: String,
        default: 'off'
    },
    visiteur: {
        type: String,
        default: 'off'
    }
})

userSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (err, encrypted) => {
        user.password = encrypted
        next()
    })

})


module.exports = mongoose.model('usercollection', userSchema)