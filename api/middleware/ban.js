const User = require('../database/models/userModel')

module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user) => {
        if (user && user.isBan == true && !error) {
            res.redirect('/')
        } else {
            next
        }
    })
}