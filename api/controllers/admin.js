const usermodel = require('../database/models/userModel')
const expomodel = require('../database/models/expoModel')


module.exports = {
    get: async (req, res) => {
        const dbuser = await usermodel.find({})
        const dbexpo = await expomodel.find({})
        res.render('admin/admin', { dbuser, dbexpo })
    }
}