/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const usermodel = require('../database/models/userModel')
const expomodel = require('../database/models/expoModel')
const bcrypt = require('bcrypt')

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: async (req, res) => {
        const dbexpo = await expomodel.find({})
        const RT = req.cookies.rememberToast
        const GA = req.cookies.rememberGA

        res.render('home', { dbexpo, RT, GA })
    },

    post: async (req, res) => {
        const email = req.body.email
        const password = req.body.password
        const User = await usermodel.findOne({ email: email })

        if (!User) {
            console.log('1');
            
            res.redirect('/')
        } else {
            console.log('2');
            
            bcrypt.compare(password, User.password, (err, same) => {
                if (!same) {
                    console.log('3');
                    
                    res.redirect('/')
                } else {
                    console.log('4');
                    
                    if (User.isAdmin == true) {
                        req.session.userId = User._id
                        req.session.name = User.lastname
                        req.session.isVerified = User.isVerified
                        req.session.isAdmin = User.isAdmin
                        req.session.email = User.email
                        res.redirect('back')
                    } else if (User.isVerified == true) {
                        req.session.userId = User._id
                        req.session.name = User.lastname
                        req.session.isVerified = User.isVerified
                        req.session.email = User.email
                        res.redirect('back')
                    } else {
                        req.session.userId = User._id
                        req.session.name = User.lastname
                        req.session.email = User.email
                        res.redirect('back')
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