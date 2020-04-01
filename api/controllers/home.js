const usermodel = require('../database/models/userModel')
const expomodel = require('../database/models/expoModel')
const bcrypt = require('bcrypt')

module.exports = {
    get: async (req, res) => {
        const dbexpo = await expomodel.find({})
        res.render('home', { dbexpo })
    },

    post: async (req, res) => {
        const email = req.body.email
        const password = req.body.password
        const User = await usermodel.findOne({ email: email })

        if (!User) {
            res.redirect('/')
        } else {
            bcrypt.compare(password, User.password, (err, same) => {
                if (!same) {
                    res.redirect('/')
                } else {
                    if (User.isAdmin == true) {
                        req.session.userId = User._id
                        req.session.name = User.lastname
                        req.session.isVerified = User.isVerified
                        req.session.isAdmin = User.isAdmin
                        req.session.email = User.email
                        res.redirect('/')
                    } else if (User.isVerified == true) {
                        req.session.userId = User._id
                        req.session.name = User.lastname
                        req.session.isVerified = User.isVerified
                        req.session.email = User.email
                        res.redirect('/')
                    } else {
                        req.session.userId = User._id
                        req.session.name = User.lastname
                        req.session.email = User.email
                        res.redirect('/')
                    }
                }
            })
        }
    },
    getLogout: (req, res, next) => {
        req.session.destroy(() => {
            res.clearCookie('coucou');
            res.redirect('/')
        })
    }

}