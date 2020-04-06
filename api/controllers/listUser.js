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
        res.render('admin/listUser', { dbuser })
    },

    put: (req, res) => {
        const myuser = { _id: req.params.id }
        if (req.body.status === 'isAdmin') {
            usermodel.updateOne(
                myuser,
                {
                    name: req.body.name,
                    isVerified: true,
                    isAdmin: true,
                    isBan: false
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
        } else if (req.body.status === 'isVerified') {
            usermodel.updateOne(
                myuser,
                {
                    name: req.body.name,
                    isVerified: true,
                    isAdmin: false,
                    isBan: false
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
        } else if (req.body.status === 'isBan') {
            usermodel.updateOne(
                myuser,
                {
                    name: req.body.name,
                    isVerified: false,
                    isAdmin: false,
                    isBan: true
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
        }
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


