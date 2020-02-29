const usermodel = require('../database/models/userModel')
const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')

// *************parametrage nodemailer***************

const transporter = nodemailer.createTransport({ //creation de la constante transporteur 
    host: "smtp.gmail.com", // host de l'hebergeur de l'adresse mail
    service: 'gmail', // nom du service
    port: 587, // port du service
    secure: false, // permet de passer la connection en TLS, laisser sur false lors de l'utilisation des port 587 et 25
    auth: { // info de connection au compte d'envoi de mail
        user: "test.willy72@gmail.com",
        pass: "totocaca"
    },
    tls: {
        rejectUnauthorized: false // définit des options TLSSocket node.js supplémentaires à transmettre au constructeur de socket,
    }
})

var rand, mailOptions, host, link // creation de variable sans affectation pour une portée global 


module.exports = {

    // *************fonction POST***************
    post: (req, res) => {
        const Pass = req.body.password
        const confPass = req.body.confpassword
        const checkbox = req.body.checkbox

        // Nodemailer config  affectation des constantes declaré plus haut
        rand = Math.floor((Math.random() * 100) + 54) //crer un chiffre random
        host = req.get('host') // adresse du site hebergant l'envoi du mail de verif
        link = "http://" + req.get('host') + "/verify/" + rand // construction du lien avec adresse du site et le chiffre random
        mailOptions = {
            from: 'test.willy72@gmail.com', // adresse du mail qui envoi le lien de verif
            to: req.body.email, // adresse de la personne qui s'inscrit
            subject: 'Merci de confirmer votre compte email', // sujet du mail de verif
            rand: rand, // nombre random generer a l'envoi du mail
            html: "Bonjour, j'ai voulu faire un truc beau... mais on va faire simple.<br> Merci de cliquer sur ce lien pour verifier votre adresse mail <br><a href=" + link + ">Cliquer ici pour verifier</a>", // contenu du mail
        }


        if (Pass !== confPass) {
            res.redirect('/inside')
        } else {
            if (checkbox !== 'on') {
                res.redirect('/inside')
            } else {
                if (!req.file) {
                    res.redirect('/inside')
                } else {
                    usermodel.create(
                        {
                            name: req.body.username,
                            email: req.body.email,
                            image: `/assets/ressources/images/${req.file.filename}`,
                            img: req.file.path,
                            password: req.body.password,
                        },
                        // Nodemailer transport      
                        transporter.sendMail(mailOptions, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail
                            if (err) {
                                res.send(err)
                            } else {
                                console.log('Message envoyé');
                                next()
                            }
                        }),
                        (error, post) => {
                            res.redirect('/inside')
                        })
                }
            }
        }
    },

    // *************Page de verification d'email***************
    verifMail: async (req, res, next) => {
        const userID = await usermodel.findOne({ email: mailOptions.to }) 
        query = { _id: userID._id }

        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) { //compare le lien utiliser pour venir sur la page et celui de la page 
            // console.log("Domain is matched. Information is from Authentic email")
            if (req.params.id == mailOptions.rand) { //recupere le numero random present dans le mail

                usermodel.findByIdAndUpdate( // modifie l'info isVerified de l'utilisateur 
                    { query },
                    {
                        isVerified: true
                    },
                    (err) => {
                        if (!err) {
                            res.redirect('/verifMail')
                        } else {
                            res.rend(err)
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

    // *************fonction GET***************
    get: async (req, res) => {
        const dbuser = await usermodel.find(req.params.id)
        res.render('inside', { dbuser })
    },

    logout: (req, res, next) => {
        req.session.destroy(() => {
            res.clearCookie,
                res.redirect('/')
        })
    },

    // *************fonction PUT***************
    put: async (req, res) => {
        const myuser = await usermodel.findById({ _id: req.params.id })
        const pathImg = await myuser.img

        if (!req.file) {
            usermodel.updateOne(
                myuser,
                {
                    name: req.body.username,
                    email: req.body.email,
                    isAdmin: req.body.select
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/inside')
                    } else {
                        res.send(err)
                    }
                }
            )
        } else {
            fs.unlink(
                pathImg,
                (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        usermodel.updateOne(
                            myuser,
                            {
                                name: req.body.username,
                                email: req.body.email,
                                image: `/assets/ressources/images/${req.file.filename}`,
                                img: req.file.path,
                            },
                            { multi: true },
                            (err) => {
                                if (err) {
                                    res.send(err)
                                } else {
                                    res.redirect('/inside')

                                }
                            }
                        )
                    }
                })
        }
    },

    // *************fonction DELETE***************
    delete: async (req, res) => {
        const myuser = await usermodel.findById({ _id: req.params.id })
        const pathImg = myuser.img

        usermodel.deleteOne(
            myuser,
            (err) => {
                if (err) {
                    res.send(err)
                } else {
                    fs.unlink(pathImg,
                        (err) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('photo effacé');

                                res.redirect('/inside')
                            }
                        })
                }
            }
        )
    },

    // *************fonction DELETEALL***************
    deleteAll: (req, res) => {
        const directory = path.resolve("publics/ressources/images")
        usermodel.deleteMany((err) => {
            if (!err) {
                fs.readdir(directory, (err, files) => {
                    if (!err) {
                        for (const file of files) {
                            fs.unlink(path.join(directory, file), (err) => {
                                if (!err) {
                                    // console.log('image effacé ?');
                                } else {
                                    console.log(err);
                                }
                            })
                        }
                        res.redirect('/inside')
                    } else {
                        console.log(err);
                    }
                })
            } else {
                res.send(err)
            }
        })
    }
}
