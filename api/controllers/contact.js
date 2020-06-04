/************************
 *                      * 
 *      Constante       *   
 *                      *
 ************************/

const contactmodel = require('../database/models/contactModel')
const nodemailer = require('nodemailer')
const key = require('../config')
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

var mailOptions

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {

    get: async (req, res) => {
        const RT = req.cookies.rememberToast
        const GA = req.cookies.rememberGA
        res.render('contact', { RT, GA })
    },

    post: (req, res) => {
        const RT = req.cookies.rememberToast
        const GA = req.cookies.rememberGA
        const subject = req.body.sujet
        const dest = req.body.email
        const name = req.session.name || req.body.email
        const message = req.body.message
        const errors = validationResult(req)

        mailOptions = {
            replyTo: dest, // adresse de la personne qui envoi le mail
            to: key.mailUser, // adresse du site
            subject: subject, // sujet du mail 
            html: "Bonjour.<br> Mr " + name + " vous a envoyé un message : <br>" + message + "<br>"   // contenu du mail
        }
        if (!errors.isEmpty()) {
            const RT = req.cookies.rememberToast
            console.log(errors);
            
            return res.status(422).render('contact', { errors: errors.array(), RT, GA });
        } else {
            transporter.sendMail(mailOptions, (err, res, next) => {
                if (err) {
                    res.send(err)
                } else {
                    contactmodel.create({
                        email: dest, 
                        sujet: subject, 
                        message: message
                    })
                    next()
                }
            })
            res.render('success', {RT, GA})
        }
    }
}