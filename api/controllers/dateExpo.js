const expomodel = require('../database/models/expoModel')

module.exports = {
    get: async (req, res) => {
        const date = new Date()
        const dbexpo = await expomodel.find({ startDate: {$gte: date}})
        console.log(date)
        console.log(dbexpo)
        res.render('dateExpo', {dbexpo})
    }
}