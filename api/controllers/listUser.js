/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const usermodel = require('../database/models/userModel')

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: async (req, res) => {
        const dbuser = await usermodel.find(req.params.id)
        const RT = req.cookies.rememberToast
        res.render('admin/listUser', { dbuser, RT })
    },

    put: (req, res) => {
        
        const myuser = { _id: req.params.id }
        
            usermodel.updateOne(
                myuser,
                {
                    isVerified:req.body.isVerified,
                    isAdmin:req.body.isAdmin,
                    isBan: req.body.isBan
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/listUser')
                    } else {
                        res.rend(err)
                    }
                }
            )        
    },

    delete: async (req, res) => {
        const myuser = await usermodel.findById({ _id: req.params.id })

        usermodel.deleteOne(
            myuser,
            (err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.redirect('/listuser')
                }
            }
        )
    },
}


