const expomodel = require('../database/models/expoModel')

module.exports = {
    get: async (req, res) => {
        const dbexpo = await expomodel.find({})
        res.render('locationExpo', { dbexpo } )
    },
    post: async (req, res) => {
        console.log(req.body)
        const dep = req.body.departement
        const dbexpo = await expomodel.find({}) 
        res.render('locationExpo', { dbexpo, dep  } )
    }
}