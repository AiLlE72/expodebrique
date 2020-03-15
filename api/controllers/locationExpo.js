const expomodel = require('../database/models/expoModel')

module.exports = {
    get: async (req, res) => {
        const dbexpo = await expomodel.find({})
        const dbdep =  await expomodel.find({})               
        res.render('locationExpo', { dbexpo, dbdep } )
    },
    post: async (req, res) => {
        const dbdep =  await expomodel.find({})
        const dep = req.body.departement
        
        if(dep === "all"){
            const dbexpo = await expomodel.find({})
            res.render('locationExpo', { dbexpo, dbdep } )
        } else {
            const dbexpo = await expomodel.find({departement: dep}) 
            res.render('locationExpo', { dbexpo, dbdep } )
        }
        
    }
}