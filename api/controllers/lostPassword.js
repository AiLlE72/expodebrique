const usermodel = require('../database/models/userModel')
const bcrypt = require('bcrypt')
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

var rand, mailOptions, host, link // creation de variable sans affectation pour une portée global

module.exports = {
    get: (req, res) => {
        res.render('lostPassword');
    },


    post: async (req, res) => {
        const userID = await usermodel.findOne({ email: req.body.email })
        // Nodemailer config  affectation des constantes declaré plus haut
        rand = Math.floor((Math.random() * 100) + 37) //crer un chiffre random
        host = req.get('host') // adresse du site hebergant l'envoi du mail de verif
        link = "http://" + req.get('host') + "/newPassword/" + rand // construction du lien avec adresse du site et le chiffre random
        mailOptions = {
            from: key.mailUser, // adresse du mail qui envoi le lien de verif
            to: req.body.email, // adresse de la personne qui s'inscrit
            subject: 'Reinitialisation de mot de passe', // sujet du mail de verif
            rand: rand, // nombre random generer a l'envoi du mail
            html: "Bonjour.<br> Merci de cliquer sur ce lien pour reinitialisé votre mot de passe <br><a href=" + link + ">Cliquer ici pour verifier</a>", // contenu du mail
        }

        if (!userID) {
            res.send('pas dans la base')
        } else {
            // Nodemailer transport      
            transporter.sendMail(mailOptions, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail
                if (err) {
                    res.send(err)
                } else {
                    next()
                }
            })
            res.redirect('/')
        }
    },

    getReset: async (req, res) => {
        const user = await usermodel.findOne({ email: mailOptions.to })  //recherche de l'utilisateur concerné par l'email (celui à qui on envoi et donc celui recup via req.body lors du post)
        const rand = req.params.id

        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) { //compare le lien utiliser pour venir sur la page et celui de la page 
            // console.log("Domain is matched. Information is from Authentic email")
            if (rand == mailOptions.rand) { //recupere le numero random present dans le mail
                res.render('newPassword', { user, rand })
            } else {
                res.send(" Bad Request")
            }
        } else {
            res.send('Request is from unknow source')
        }
    },

    postReset: async (req, res) => {
        const userID = await usermodel.findOne({ email: mailOptions.to })
        const Pass = req.body.password
        const confPass = req.body.confpassword


        if (Pass !== confPass || Pass === '') {
            res.send(err)
        } else {
            const passCrypt = bcrypt.hashSync(Pass, 10)
            usermodel.findByIdAndUpdate( // modifie l'info isVerified de l'utilisateur 
                userID._id,
                {
                    password: passCrypt
                },
                (err) => {
                    if (!err) {
                        res.redirect('/')
                    } else {
                        console.log(err);
                        res.send(err)
                    }
                }
            )
        }
    }
}