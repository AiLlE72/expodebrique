const expomodel = require('../database/models/expoModel')
const nodemailer = require('nodemailer')
const key = require('../config')

//configuration nodemailer
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

var mailOptions // creation de variable sans affectation pour une portée global


module.exports = {
    get: async (req, res) => {
        const id = req.params.id
        const dbexpo = await expomodel.findById(req.params.id)
        res.render('contactorga', { dbexpo, id })
    },

    post: async (req, res) => {
        const dbexpo = await expomodel.findById(req.params.id)
        const expo = dbexpo.name
        const dest = req.body.email || req.body.email2
        const sujet = req.body.sujet
        const mess = req.body.message
        mailOptions = {
            from: dest, // adresse du mail qui envoi le lien de verif
            to: dbexpo.contact, // adresse de la personne qui s'inscrit
            subject: sujet, // sujet du mail de verif
            html: "Bonjour.<br> Une personne souhaite entrer en contact avec vous dans le cadre de l'exposition que vous organisez : " + expo + ". <br>Repondez à ce mail pour entrée en contact avec cette personne.<br>Voici son message : " + mess, // contenu du mail
        },

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