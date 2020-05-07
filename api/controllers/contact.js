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
        res.render('contact', { RT })
    },

    post: (req, res) => {
        const subject = req.body.sujet
        const dest = req.body.email || req.body.email2
        const name = req.session.name || req.body.email2
        const message = req.body.message
        const errors = validationResult(req)

        mailOptions = {
            replyTo: dest, // adresse de la personne qui envoi le mail
            to: key.mailUser, // adresse du site
            subject: subject, // sujet du mail 
            html: "Bonjour.<br> Mr " + name + " vous a envoyé un message : <br>" + message + "<br>"   // contenu du mail
        }
        if (!errors.isEmpty()) {
            console.log(errors)
            const RT = req.cookies.rememberToast
            return res.status(422).render('contact', { errors: errors.array(), RT });
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