const expomodel = require('../database/models/expoModel')

module.exports = {
    get: async (req, res) => {
        const date = new Date()
        const dbexpo = await expomodel.find({ startDate: {$gte: date}})
        const dbdep =  await expomodel.find({ startDate: {$gte: date}})               
        res.render('locationExpo', { dbexpo, dbdep } )
    },
    post: async (req, res) => {
        const dbdep =  await expomodel.find({})
        const dep = req.body.departement
        const date = new Date()
        if(dep === "all"){
            const dbexpo = await expomodel.find({})
            res.render('locationExpo', { dbexpo, dbdep } )
        } else {
            const dbexpo = await expomodel.find({startDate: {$gte: date}, departement: dep}) 
            res.render('locationExpo', { dbexpo, dbdep } )
        }
        
    }
}