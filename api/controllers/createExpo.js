/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const expomodel = require('../database/models/expoModel')
const depmodel = require('../database/models/depModel')
const fs = require('fs')
const usermodel = require('../database/models/userModel')
const nodemailer = require('nodemailer')
const key = require('../config')
const { check, validationResult } = require('express-validator')
const sharp = require('sharp')

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: async (req, res) => {
        const dbdepartement = await depmodel.find({})
        const RT = req.cookies.rememberToast
        const GA = req.cookies.rememberGA
        res.render('createExpo', { dbdepartement, RT, GA })
    },
    post: async (req, res) => {
        const errors = validationResult(req)

        // variable pour la modification du rendu de la checkbox "search"
        var search
        if (req.body.search === 'on') {
            search = 'true'
        } else {
            search = 'false'
        }

        if (!errors.isEmpty()) {
            const dbdepartement = await depmodel.find({})
            const RT = req.cookies.rememberToast

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    res.send(err)
                } else {
                    return res.status(422).render('createExpo', { errors: errors.array(), dbdepartement, RT })
                }
            })

        } else {
            const name = Date.now() + req.file.originalname.split(' ').join('_').split('.').slice(0. - 1).join('.') + ".webp"

            sharp(req.file.path)
                .resize(230)
                .webp({ quality: 100 })
                .toFile('publics/ressources/images/web/' + name, (err, info) => { })

            expomodel.create({
                name: req.body.name,
                adress: req.body.adress,
                city: req.body.city,
                departement: req.body.departement,
                postCode: req.body.postCode,
                country: req.body.country,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                fullaffiche: `assets/ressources/images/${req.file.filename}`,
                fullimage: req.file.path,
                lowaffiche: `assets/ressources/images/web/${name}`,
                lowimage: `publics/ressources/images/web/${name}`,
                horaire: req.body.horaire,
                price: req.body.price,
                contact: req.body.contact,
                search: search
            },


                async (error, next) => {
                    if (search === 'true') {
                        const transporter = nodemailer.createTransport({ //creation de la constante transporteur 
                            host: key.host,
                            service: key.service,
                            port: key.port,
                            secure: key.secure,
                            auth: {
                                user: key.mailUser,
                                pass: key.mailPass
                            },
                            tls: {
                                rejectUnauthorized: key.rejectUnauthorized
                            }
                        })

                        var mailOptions
                        const Departement = req.body.departement
                        const dest = await usermodel.find({ departement: Departement, exposant: 'true' })

                        for (let i = 0; i < dest.length; i++) {
                            const destinataire = dest[i]
                            mailOptions = {
                                from: key.mailUser, // adresse du mail qui envoi le mail
                                to: destinataire.email, // adresse des personne interesser pour exposer dans le departement
                                subject: "une exposition pres de chez vous recherche des exposants. ", // sujet du mail 
                                html: "Bonjour.<br> Une Exposition près de chez vous est à la recherche d'exposant : " + req.body.name + ".<br>Pour plus d'information, nous vous invitons à contacter l'organisateur via la fiche de l'exposition sur notre site.<br>Pour modifier la façon dont vous recevez les mails contactez-nous sur le <a href=http://localhost:3000>site</a>."
                            }
                            transporter.sendMail(mailOptions, (err, res, next) => {
                                if (err) {
                                    res.send(err)
                                } else {
                                    next
                                }
                            })
                        }
                    } else {
                        next
                    }
                    res.redirect('/')
                })
        }

    },

    put: async (req, res) => {
        const errors = validationResult(req)
        const myexpo = await expomodel.findById({ _id: req.params.id })
        const image = await myexpo.fullimage
        const lowImage = await myexpo.lowimage

        // variable pour la modification du rendu de la checkbox "search"
        var search
        if (req.body.search === 'on') {
            search = 'true'
        } else {
            search = 'false'
        }

        if (!errors.isEmpty()) {
            const dbdepartement = await depmodel.find({})
            const dbexpo = await expomodel.find({}).populate("departement")
            const RT = req.cookies.rememberToast

            res.redirect('/allExpo')
        } else {

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
                const name = Date.now() + req.file.originalname.split(' ').join('_').split('.').slice(0, -1).join('.') + ".webp"
                fs.unlink(
                    image,
                    (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            fs.unlink(
                                lowImage,
                                (err) => {
                                    if (err) {
                                        res.send(err)
                                    } else {
                                        sharp(req.file.path)
                                        .resize(230)
                                        .webp({ quality: 100 })
                                        .toFile('publics/ressources/images/web/' + name, (err, info) => { })
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
                                                fullaffiche: `assets/ressources/images/${req.file.filename}`,
                                                fullimage: req.file.path,
                                                lowaffiche: `assets/ressources/images/web/${name}`,
                                                lowimage: `publics/ressources/images/web/${name}`,
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
                                }
                            )

                        }
                    })
            }
        }
    }
}
