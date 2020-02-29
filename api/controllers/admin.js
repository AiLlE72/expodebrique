const usermodel = require('../database/models/userModel')

module.exports = {
    get: async (req, res) => {
        const dbuser = await usermodel.find({})
        res.render('inside', {
            layout: 'admin',
            dbuser
        } )
    }
}