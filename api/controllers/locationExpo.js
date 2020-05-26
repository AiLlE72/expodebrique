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
        const d = new Date()
        const date = d.setDate(d.getDate() - 2);
        const dbdep = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        const dbdepartement = await depmodel.find({})
        const RT = req.cookies.rememberToast
        res.render('locationExpo', { dbexpo, dbdep, dbdepartement, RT })
    },
    post: async (req, res) => {
        const d = new Date()
        const date = d.setDate(d.getDate() - 2);
        const dbdep = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        const dbdepartement = await depmodel.find({})
        const dep = req.body.departement
        const RT = req.cookies.rememberToast
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const RT = req.cookies.rememberToast
            return res.status(422).render('locationExpo', { errors: errors.array(), dbexpo, dbdep, dbdepartement, RT });
        } else {
            if (dep === "all") {
                const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
                res.render('locationExpo', { dbexpo, dbdep, dbdepartement, RT })
            } else {
                const dbexpo = await expomodel.find({ startDate: { $gte: date },departement: dep })
                res.render('locationExpo', { dbexpo, dbdep, dbdepartement, RT })
            }

        }

    }
}