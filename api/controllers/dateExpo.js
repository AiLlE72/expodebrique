/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: async (req, res) => {
        const d = new Date()
        const date = d.setDate(d.getDate() - 2)
        const dbexpo = await expomodel.find({ startDate: {$gte: date}}).populate("departement")
        const dbdepartement = await depmodel.find({})
        const RT = req.cookies.rememberToast
        const GA = req.cookies.rememberGA

        res.render('dateExpo', {dbexpo, dbdepartement, RT, GA})
    }
}