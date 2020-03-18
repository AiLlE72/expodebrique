const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')

module.exports = {
    get: async (req, res) => {
        const date = new Date()
        const dbexpo = await expomodel.find({ startDate: {$gte: date}}).populate("departement").exec((Dbexpo, err) => {
            if(err){
                console.log('coucou');
                
                res.send(err)
            } else {
                console.log('coucou2');
                
                console.log(Dbexpo)
            }
        })

        const dbdep =  await expomodel.find({ startDate: {$gte: date}})  
        const dbdepartement = await depmodel.find({})             
         
        
        res.render('locationExpo', { dbexpo, dbdep, dbdepartement } )
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