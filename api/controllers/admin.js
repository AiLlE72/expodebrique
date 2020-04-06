/************************
 *                      *
 *      Constante       *
 *                      *
 ************************/

const usermodel = require('../database/models/userModel')
const expomodel = require('../database/models/expoModel')
const contactmodel = require('../database/models/contactModel')

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/


module.exports = {
    get: async (req, res) => {
        const dbuser = await usermodel.find({})
        const dbexpo = await expomodel.find({})
        const dbcontact = await contactmodel.find({})
        res.render('admin/admin', { dbuser, dbexpo, dbcontact })
    }
}