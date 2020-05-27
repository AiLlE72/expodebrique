/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const usermodel = require('../database/models/userModel')
const nodemailer = require('nodemailer')
const key = require('../config')
const depmodel = require('../database/models/depModel')
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
        const RT = req.cookies.rememberToast
        res.render('createUser', { dbdepartement, RT })
    },

    post: async (req, res) => {
        const Pass = req.body.password
        const confPass = req.body.confpassword
        const errors = validationResult(req)

        // Nodemailer config  affectation des constantes declaré plus haut
        rand = Math.floor((Math.random() * 100) + 54) //crer un chiffre random
        host = req.get('host') // adresse du site hebergant l'envoi du mail de verif
        link = "http://"+ host + "/verify/" + rand // construction du lien avec adresse du site et le chiffre random
        mailOptions = {
            from: key.mailUser, // adresse du mail qui envoi le lien de verif
            to: req.body.email, // adresse de la personne qui s'inscrit
            subject: 'Merci de confirmer votre compte email', // sujet du mail de verif
            rand: rand, // nombre random generer a l'envoi du mail
            html: "Bonjour.<br> Merci de cliquer sur ce lien pour verifier votre adresse mail <br><a href=" + link + ">Cliquer ici pour verifier</a>", // contenu du mail
        }




        var Exposant, Visiteur, Organisateur //declaration de variable pour une porté globale

        if (req.body.exposant === undefined) {
            Exposant = false
        } else {
            Exposant = true
        }

        if (req.body.organisateur === undefined) {
            Organisateur = false
        } else {
            Organisateur = true
        }

        if (req.body.Visiteur === undefined) {
            Visiteur = false
        } else {
            Visiteur = true
        }

        if (!errors.isEmpty()) {
            const dbdepartement = await depmodel.find({})
            const RT = req.cookies.rememberToast
            return res.status(422).render('createUser', { errors: errors.array(), dbdepartement, RT });
        } else {
            if (Pass !== confPass || Pass === '') {
                res.redirect('/')
            } else {
                usermodel.create(
                    {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        departement: req.body.departement,
                        pays: req.body.pays,
                        password: req.body.password,
                        exposant: Exposant,
                        organisateur: Organisateur,
                        visiteur: Visiteur,

                    },
                    (error, post) => {
                        if (error) {
                            res.send(error)
                        } else {
                            // Nodemailer transport 
                            transporter.sendMail(mailOptions, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail
                                if (err) {
                                    res.send(err)
                                } else {
                                    next()
                                }
                            }),
                                res.redirect('/')
                        }
                    })
            }
        }
    },
    verifMail: async (req, res, next) => {
        const userID = await usermodel.findOne({ email: mailOptions.to })
        const rand = req.params.id      
        console.log('host:' +  host)
	    console.log('link:'  + link )
	    console.log(req.protocol + '://' + req.get('host'))
        if ((req.protocol + "://" + req.get('host')) == ('http://' + host) ) { //compare le lien utiliser pour venir sur la page et celui de la page
	
            if (rand == mailOptions.rand) { //recupere le numero random present dans le mail
                

                usermodel.findByIdAndUpdate( // modifie l'info isVerified de l'utilisateur 
                    userID._id,
                    {
                        isVerified: true
                    },
                    (err) => {
                        if (!err) {
                            res.redirect('/verifMail')
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
    }
}
