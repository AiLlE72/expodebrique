/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const expomodel = require('../database/models/expoModel')
const nodemailer = require('nodemailer')
const key = require('../config')
const { check, validationResult } = require('express-validator')

//configuration nodemailer
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

var mailOptions // creation de variable sans affectation pour une portée global

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: async (req, res) => {
        const id = req.params.id
        const dbexpo = await expomodel.findById(req.params.id)
        const RT = req.cookies.rememberToast
        res.render('contactorga', { dbexpo, id, RT })
    },

    post: async (req, res) => {
        const dbexpo = await expomodel.findById(req.params.id)
        const expo = dbexpo.name
        const dest = req.body.email
        const sujet = req.body.sujet
        const mess = req.body.message
        const errors = validationResult(req)

        mailOptions = {
            replyTo: dest, // adresse du mail qui envoi le messagee
            to: dbexpo.contact, // adresse de la personne qui organise l'expo
            subject: sujet, // sujet du mail 
            html: "Bonjour.<br> Une personne souhaite entrer en contact avec vous dans le cadre de l'exposition que vous organisez : " + expo + ". <br>Repondez à ce mail pour entrée en contact avec cette personne.<br>Voici son message : " + mess, // contenu du mail
        }

        if (!errors.isEmpty()) {
            const id = req.params.id
            const dbexpo = await expomodel.findById(req.params.id)
            const RT = req.cookies.rememberToast

            return res.status(422).render('contactorga', { errors: errors.array(), dbexpo, id, RT });
        } else {
            transporter.sendMail(mailOptions, (err, res, next) => {
                if (err) {
                    res.send(err)
                } else {
                    next()
                }
            })
            res.render('success')
        }
    }
}