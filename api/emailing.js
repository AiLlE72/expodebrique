/************************
 *                      *
 *      Constante       *
 *                      *
 ************************/

const expomodel = require('./database/models/expoModel')
const usermodel = require('./database/models/userModel')
const nodemailer = require('nodemailer')
const key = require('./config')
const cron = require('node-cron')

/************************
 *                      *
 *     Tache Cron       *
 *                      *
 ************************/

const Mail = cron.schedule(' 0 10 25 * *', async () => {

// const Mail = cron.schedule(' */1 * * * *', async () => {
    const transporter = nodemailer.createTransport({ //creation de la constante transporteur 
        host: key.host, 
        service: key.service,
        pool: true, 
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

/************************
 *                      *
 *   Fonction emailing  *
 *                      *
 ************************/

    const dest = await usermodel.find({ isVerified: 'true', visiteur: 'true' })
    for (let i = 0; i < dest.length; i++) {
        const destinataire = dest[i]
        const nextMonth = new Date().getMonth() +2
        const year = new Date().getFullYear()
        const expoLocal = await expomodel.find({ departement: destinataire.departement, startDate: { $gt: new Date(), $lt: new Date(year + ',' + nextMonth) } })
        
        for (let i = 0; i < expoLocal.length; i++) {
            const Expo = expoLocal[i];
            mailOptions = {
                from: key.mailUser, // adresse mail qui envoi le mail
                to: destinataire.email, // adresse de l'utilisateur'
                subject: "Une exposition pres de chez vous. ", // sujet du mail 
                html: "Bonjour.<br>Une exposition à bientôt lieu près de chez vous: " + Expo.name + ".<br>Rendez vous sur notre site pour plus de détails.<br>Pour modifier la façon dont vous recevez les mails, contactez-nous sur le <a href=http://expodebrique.willyparis.fr>site</a>."
            }
            transporter.sendMail(mailOptions, (err, res, next) => {
                if (err) {
                    res.send(err)
                } else {
                    next
                }
            })
            transporter.close()
        }
    }
    console.log("Tache d'email automatique executée à : " + new Date())
})

/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    email: (Mail, next) => {
        next
    }
}

