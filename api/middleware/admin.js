const User = require('../database/models/userModel')

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user) => {
        if (user && user.isAdmin == true && !error) {
            next()
        } else {    
            return res.redirect('/createUser')
        }
    })
}