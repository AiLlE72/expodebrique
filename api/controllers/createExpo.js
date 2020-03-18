const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')
const path = require('path')


module.exports = {
    get: async(req, res) => {
        const dbdepartement = await depmodel.find({})   
        res.render('createExpo', { dbdepartement })
    },
    post: (req, res) => {

        expomodel.create({
            name: req.body.name,
            adress: req.body.adress,
            city: req.body.city,
            departement: req.body.departement,
            postCode: req.body.postCode,
            country: req.body.country,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            affiche: `assets/ressources/images/${req.file.filename}`,
            image: req.file.path,
            horaire: req.body.horaire,
            price: req.body.price,
            contact: req.body.contact,
            search: req.body.search
        },
            (error, post) => {
                if (error) {
                    res.send(error)
                } else {
                    res.redirect('/')
                }
            }

        )

    }

}