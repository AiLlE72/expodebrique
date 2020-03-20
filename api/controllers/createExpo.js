const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')
const fs = require('fs')
const path = require('path')



module.exports = {
    get: async (req, res) => {
        const dbdepartement = await depmodel.find({})
        res.render('createExpo', { dbdepartement })
    },
    post: (req, res) => {
        const search = (req.body.search == 'true' || false)
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
console.log(image)
        var search
        if (req.body.search === 'on') {
            search = 'true'
        } else {
            search = 'false'
        }

        console.log(req.file)
        if (!req.file) {
            expomodel.findOneAndUpdate(
                { myexpo },
                {
                    name: req.body.name,
                    adress: req.body.adress,
                    city: req.body.city,
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
                        console.log('UPDATE OK without image');
                        res.redirect('/allExpo')
                    } else {
                        res.send(err)
                    }
                })
        } else {
            fs.unlink(
                image,
                (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        expomodel.findOneAndUpdate(
                            { myexpo },
                            {
                                name: req.body.name,
                                adress: req.body.adress,
                                city: req.body.city,
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
                                    console.log('UPDATE OK with image');
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