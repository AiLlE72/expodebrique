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
            res.render('home')
        } else {
            bcrypt.compare(password, User.password, (err, same) => {
                if (!same) {
                    console.log("erreur de mot de passe");

                    res.render('home')
                } else {
                    if (User.isAdmin == true) {
                        req.session.userId = User._id
                        req.session.name = User.lastname
                        req.session.isVerified = User.isVerified
                        req.session.isAdmin = User.isAdmin
                        res.redirect('/')
                    } else if (User.isVerified == true) {
                        
                        
                        req.session.userId = User._id
                        req.session.name = User.lastname
                        req.session.isVerified = User.isVerified
                        console.log(req.session)
                        res.redirect('/')
                    } else {
                        req.session.userId = User._id
                        req.session.name = User.lastname
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