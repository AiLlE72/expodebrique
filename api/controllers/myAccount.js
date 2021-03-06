/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const usermodel = require('../database/models/userModel')
const depmodel = require('../database/models/depModel')
const oldusermodel = require('../database/models/oldUserModel')
const bcrypt = require('bcrypt')
const key = require('../config')
const nodemailer = require('nodemailer')
const { check, validationResult } = require('express-validator')

// *************parametrage nodemailer***************

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

var rand, mailOptions, host, link // creation de variable sans affectation pour une portée global


/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: async (req, res) => {
        const dbdepartement = await depmodel.find({})
        const user = await usermodel.findById(req.params.id).populate("departement")
        const RT = req.cookies.rememberToast
        const GA = req.cookies.rememberGA
        res.render('myAccount', { user, dbdepartement, RT, GA })
    },

    put: async (req, res) => {

        const errors = validationResult(req)
        // Nodemailer config  affectation des constantes declaré plus haut
        rand = Math.floor((Math.random() * 100) + 54) //crer un chiffre random
        host = req.get('host') // adresse du site hebergant l'envoi du mail de verif
        link = "http://" + req.get('host') + "/verifEditMail/" + rand // construction du lien avec adresse du site et le chiffre random

        if (!errors.isEmpty()) {
            console.log(errors);
            const GA = req.cookies.rememberGA
            const RT = req.cookies.rememberToast
            const dbdepartement = await depmodel.find({})
            const user = await usermodel.findById(req.params.id).populate("departement")
            return res.status(422).render('myAccount', { user, dbdepartement, RT, GA });
        } else {

            if (req.body.firstname) {
                usermodel.findByIdAndUpdate(
                    { _id: req.params.id },
                    { firstname: req.body.firstname },
                    (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.redirect('back')
                        }
                    }
                )
            } else if (req.body.lastname) {
                usermodel.findByIdAndUpdate(
                    { _id: req.params.id },
                    { lastname: req.body.lastname },
                    (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.redirect('back')
                        }
                    }
                )
            } else if (req.body.departement) {
                usermodel.findByIdAndUpdate(
                    { _id: req.params.id },
                    { departement: req.body.departement },
                    (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.redirect('back')
                        }
                    }
                )
            } else if (req.body.pays) {
                usermodel.findByIdAndUpdate(
                    { _id: req.params.id },
                    { pays: req.body.pays },
                    (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.redirect('back')
                        }
                    }
                )
            } else if (req.body.exposant) {
                usermodel.findByIdAndUpdate(
                    { _id: req.params.id },
                    { exposant: req.body.exposant },
                    (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.redirect('back')
                        }
                    }
                )
            } else if (req.body.visiteur) {
                usermodel.findByIdAndUpdate(
                    { _id: req.params.id },
                    { visiteur: req.body.visiteur },
                    (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.redirect('back')
                        }
                    }
                )
            } else if (req.body.organisateur) {
                usermodel.findByIdAndUpdate(
                    { _id: req.params.id },
                    { organisateur: req.body.organisateur },
                    (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.redirect('back')
                        }
                    }
                )
            } else if (req.body.email) {
                const user = await usermodel.findById(req.params.id)
                mailOptions = {
                    from: key.mailUser, // adresse du mail qui envoi le lien de verif
                    to: req.body.email, // adresse de la personne qui s'inscrit
                    subject: 'Merci de confirmer votre compte email', // sujet du mail de verif
                    rand: rand, // nombre random generer a l'envoi du mail
                    html: "Bonjour.<br> Merci de cliquer sur ce lien pour verifier votre adresse mail <br><a href=" + link + ">Cliquer ici pour verifier</a>", // contenu du mail
                }
                bcrypt.compare(req.body.password, user.password, (err, same) => {
                    if (!same) {
                        res.redirect('back')
                    } else {
                        usermodel.findByIdAndUpdate(
                            { _id: req.params.id },
                            { email: req.body.email },
                            (err) => {
                                if (err) {
                                    res.send(err)
                                } else {
                                    transporter.sendMail(mailOptions, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail
                                        if (err) {
                                            res.send(err)
                                        } else {
                                            next()
                                        }
                                    })
                                    res.redirect('back')
                                }
                            }
                        )
                    }
                })
            } else if (req.body.verifying) {
                mailOptions = {
                    from: key.mailUser, // adresse du mail qui envoi le lien de verif
                    to: req.body.verifying, // adresse de la personne qui s'inscrit
                    subject: 'Merci de confirmer votre compte email', // sujet du mail de verif
                    rand: rand, // nombre random generer a l'envoi du mail
                    html: "Bonjour.<br> Merci de cliquer sur ce lien pour verifier votre adresse mail <br><a href=" + link + ">Cliquer ici pour verifier</a>", // contenu du mail
                },
                    transporter.sendMail(mailOptions, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail
                        if (err) {
                            res.send(err)
                        } else {
                            next()
                        }
                    })
                res.redirect('back')
            }
        }
    },

    verifEditMail: async (req, res, next) => {
        const userID = await usermodel.findOne({ email: mailOptions.to })
        const rand = req.params.id
        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) { //compare le lien utiliser pour venir sur la page et celui de la page 
            // console.log("Domain is matched. Information is from Authentic email")
            if (rand == mailOptions.rand) { //recupere le numero random present dans le mail

                usermodel.findByIdAndUpdate( // modifie l'info isVerified de l'utilisateur 
                    userID._id,
                    {
                        isVerified: true
                    },
                    (err) => {
                        if (!err) {
                            res.redirect('/myAccount/' + userID._id)
                        } else {
                            res.send(err)
                        }
                    }
                )
            } else {
                res.send(" Bad Request")
            }
        } else {
            res.send('Request is from unknow source')
        }
    },

    delete: async (req, res, next) => {
        const myUser = await usermodel.findById(req.params.id)

        oldusermodel.create(
            {
                firstname: myUser.firstname,
                lastName: myUser.lastname,
                email: myUser.email

            },
            (error) => {
                if (error) {
                    res.send(error)
                } else {
                    usermodel.findByIdAndRemove(req.params.id, (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            req.session.destroy(() => {
                                res.clearCookie('coucou');
                                res.redirect('/')
                            })
                        }
                    })

                }
            })

    }
}
