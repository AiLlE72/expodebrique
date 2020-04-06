/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const contactmodel = require('../database/models/contactModel')

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: async (req, res) => {
        const dbcontact = await contactmodel.find({})
        res.render('admin/listContact', { dbcontact })
    },
    delete: async (req, res) => {
        const mycontact = await contactmodel.findById({ _id: req.params.id })

        contactmodel.deleteOne(
            mycontact,
            (err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.redirect('/listContact')
                }
            }
        )
    },
}