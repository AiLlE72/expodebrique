const contactmodel = require('../database/models/contactModel')
const nodemailer = require('nodemailer')
const key = require('../config')

// *************parametrage nodemailer***************
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
    }
})

var mailOptions
// *************module****************************

module.exports = {

    get: async (req, res) => {
        res.render('contact')
    },

    post: (req, res) => {
        const subject = req.body.sujet
        const dest = req.body.email || req.body.email2
        const name = req.session.name
        const message = req.body.message

        mailOptions = {
            replyTo: dest, // adresse de la personne qui envoi le mail
            to: key.mailUser, // adresse du site
            subject: subject, // sujet du mail 
            html: "Bonjour.<br> Mr " + name + " vous a envoyé un message : <br>" + message + "<br>"   // contenu du mail
        }

        contactmodel.create({
            name: name,
            email: dest,
            sujet: subject,
            message: message
        }, transporter.sendMail(mailOptions, (err, res, next) => {
            if (err) {
                res.send(err)
            } else {
                next()
            }
        }),
            (error, post) => {
                if (error) {
                    res.send(error)
                } else {
                    res.redirect('/success')
                }
            })
    }
}