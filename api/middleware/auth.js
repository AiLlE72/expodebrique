const usermodel = require('../database/models/userModel')

module.exports = (req, res, next) => {
    usermodel.findById(req.session.userId, (error, usermodel) => {
        if (!usermodel || error) {    
            return res.redirect('/')
        } else {
            next()
        }
    })
}

