const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')

module.exports = {
    get: async (req, res) => {
        const dbdepartement = await depmodel.find({})
        const dbexpoAll = await expomodel.find({}).populate("departement")
        res.render('allExpo', { dbexpoAll, dbdepartement } )
           
    },
}