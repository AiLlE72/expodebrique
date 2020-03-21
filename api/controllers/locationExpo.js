const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')


module.exports = {
    get: async (req, res) => {
        const d = new Date()
        const date = d.setDate(d.getDate() - 2);
        const dbdep = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        const dbdepartement = await depmodel.find({})
        res.render('locationExpo', { dbexpo, dbdep, dbdepartement })  
    },
    post: async (req, res) => {
        const d = new Date()
        const date = d.setDate(d.getDate() - 2);
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