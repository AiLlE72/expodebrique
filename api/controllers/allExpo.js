/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')
const { check, validationResult } = require('express-validator')

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: async (req, res) => {
        const dbdepartement = await depmodel.find({})
        const dbexpo = await expomodel.find({}).populate("departement")
        const RT = req.cookies.rememberToast
        res.render('allExpo', { dbdepartement, dbexpo, RT })
    },
}