const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')
const fs = require('fs')




module.exports = {
    get: async (req, res) => {
        const dbdepartement = await depmodel.find({})
        res.render('createExpo', { dbdepartement })
    },
    post: (req, res) => {
        var search
        if (req.body.search === 'on') {
            search = 'true'
        } else {
            search = 'false'
        }
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
            search: search
        },
            (error, post) => {
                if (error) {
                    res.send(error)
                } else {
                    res.redirect('/')
                }
            }
        )
    },

    put: async (req, res) => {
        const myexpo = await expomodel.findById({ _id: req.params.id })
        const image = await myexpo.image
        var search
        if (req.body.search === 'on') {
            search = 'true'
        } else {
            search = 'false'
        }

        if (!req.file) {
            expomodel.findByIdAndUpdate(
                {  _id: req.params.id },
                {
                    name: req.body.name,
                    adress: req.body.adress,
                    city: req.body.city,
                    departement: req.body.departement,
                    postCode: req.body.postCode,
                    country: req.body.country,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    horaire: req.body.horaire,
                    price: req.body.price,
                    contact: req.body.contact,
                    search: search
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        
                        res.redirect('/allExpo')
                    } else {
                        res.send(err)
                    }
                })
        } else {
            console.log(req.file)
            fs.unlink(
                image,
                (err) => {
                    if (err) {
                        res.send(err)
                    } else {
                        expomodel.findByIdAndUpdate(
                            {  _id: req.params.id },
                            {
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
                                contact: req.body.contact
                            },
                            { multi: true },
                            (err) => {
                                if (!err) {
                                    res.redirect('/allExpo')
                                } else {
                                    res.send(err)
                                }
                            })
                    }
                })
        }
    }
}