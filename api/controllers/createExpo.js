const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')
const fs = require('fs')
const usermodel = require('../database/models/userModel')
const nodemailer = require('nodemailer')
const key = require('../config')




module.exports = {
    get: async (req, res) => {
        const dbdepartement = await depmodel.find({})
        res.render('createExpo', { dbdepartement })
    },
    post: async (req, res) => {
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
        }),



            async (error) => {
                // if (search === true) {

                    if (error) {
                        res.send(error)
                    } else {
                        const transporter = nodemailer.createTransport({ //creation de la constante transporteur 
                            host: "smtp.gmail.com", // host de l'hebergeur de l'adresse mail
                            service: 'gmail', // nom du service
                            port: 587, // port du service
                            secure: false, // permet de passer la connection en TLS, laisser sur false lors de l'utilisation des port 587 et 25
                            auth: { // info de connection au compte d'envoi de mail
                                user: key.mailUser,
                                pass: key.mailPass
                            },
                            tls: {
                                rejectUnauthorized: false // définit des options TLSSocket node.js supplémentaires à transmettre au constructeur de socket,
                            },
                            pool: true
                        })


                        var mailOptions
                        const Departement = req.body.departement
                        const dest = await usermodel.find({ departement: Departement, exposant: 'on' })


                        for (let i = 0; i < dest.length; i++) {
                            const destinataire = dest[i]
                            mailOptions = {
                                from: req.body.contact, // adresse du mail qui envoi le lien de verif
                                to: destinataire.email, // adresse de la personne qui s'inscrit
                                subject: "une exposition pres de chez vous recherche des exposants. ", // sujet du mail de verif
                                html: "Bonjour. Une Exposition près de chez vous est à la recherche d'exposant : "
                            }
                            transporter.sendMail(mailOptions, (err, res, next) => {
                                if (err) {
                                    console.log('coucou')
                                    console.log(err);
                                } else {
                                    next()
                                }
                            })
                        }
                    }

                // } else {
                //     next()
                // }
                res.redirect('/')
            }
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
                { _id: req.params.id },
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
                            { _id: req.params.id },
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
                                contact: req.body.contact,
                                author: req.session.name

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
