const expomodel = require('../database/models/expoModel')

module.exports = {
    get: async (req, res) => {
        const dbexpo = await expomodel.find({})
        res.render('allExpo', { dbexpo } )   
    },
}