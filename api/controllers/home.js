const usermodel = require('../database/models/userModel')
const bcrypt = require('bcrypt')

module.exports = {
    get: (req, res) => {
        res.render('home')
    },

    post: async (req, res) => {
        const name = req.body.name
        const password = req.body.password
        const User = await usermodel.findOne({ name: name })

        if (!User) {
            res.render('home')
        } else {
            bcrypt.compare(password, User.password, (err, same) => {
                if (!same) {

                    res.render('home')
                } else {
                    if(User.isAdmin == true){
                        req.session.userId = User._id
                        req.session.name = User.name
                        req.session.isAdmin = User.isAdmin   
                        res.redirect('/inside')
                    } else {
                        req.session.userId = User._id
                        req.session.name = User.name
                        res.redirect('/inside')
                    }    
                }
            })
        }
    }
}