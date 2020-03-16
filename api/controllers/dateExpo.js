const expomodel = require('../database/models/expoModel')

module.exports = {
    get: async (req, res) => {
        const date = new Date()
        const dbexpo = await expomodel.find({ startDate: {$gte: date}})
        res.render('dateExpo', {dbexpo})
    }
}