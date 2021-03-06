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
        const RT = req.cookies.rememberToast
        const GA = req.cookies.rememberGA

        res.render('admin/listContact', { dbcontact, RT, GA })
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