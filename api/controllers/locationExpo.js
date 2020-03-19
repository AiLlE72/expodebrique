const expomodel = require('../database/models/expoModel')


module.exports = {
    get: async (req, res) => {
        const date = new Date()
        const dbdep = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        res.render('locationExpo', { dbexpo, dbdep })  
    },
    post: async (req, res) => {
        const date = new Date()
        const dbdep = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        const dep = req.body.departement

        console.log(dep)
        if (dep === "all") {
            const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
            res.render('locationExpo', { dbexpo, dbdep })
        } else {
            const dbexpo = await expomodel.find({departement: dep})
            res.render('locationExpo', { dbexpo, dbdep })
        }
    }
}