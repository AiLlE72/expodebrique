const expomodel = require('../database/models/expoModel')
const fs = require('fs')
const path = require('path')

module.exports = {
    get: (req, res) => {
        res.render('createExpo')
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
            image: `/assets/ressources/images/${req.file.filename}`,
            affiche: req.file.path,
            contact: req.bodycontact,
            search: req.body.search
        },
        (error, post) => {
            if(error){
                res.send(error)
            } else {
                res.redirect('/')
            }
        }

        )

    }

}