const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')

module.exports = {
    get: async (req, res) => {
        const d = new Date()
        const date = d.setDate(d.getDate() - 2);
        const dbexpo = await expomodel.find({ startDate: {$gte: date}})
        res.render('dateExpo', {dbexpo, dbdepartement})
    }
}