const expomodel = require('../api/database/models/expoModel')
const assert = require('chai').assert
const mongoose = require('mongoose')
const key = require('../api/config')
const nodemailer = require('nodemailer')

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

describe('envoyer un mail ', function () {
   
    //On teste l'envoi du mail
    it("l'email est bien envoyé", () => {
        mailOptions = {
            from: key.mailUser, // adresse mail qui envoie le mail
            to: "expodebrique@gmail.com", // adresse de l'utilisateur'
            subject: "Mail : test unitaire ", // sujet du mail 
            html: "test"
        }
        transporter.sendMail(mailOptions, (err, res, next) => {
            if (err) {
                res.send(err)
            } else {
                next()
            }
            assert.equal(res.accepted, ['expodebrique@gmail.com']) 
            assert.notEqual(res.rejected, ['expodebrique@gmail.com'])
        });
    });
});

describe('envoyer un mail erronée ', function () {
    
    //On teste le refus du mail
    it("l'email est bien refusé", () => {
        mailOptions = {
            from: key.mailUser, // adresse mail qui envoie le mail
            to: "expodebrique@gmal.com", // adresse de l'utilisateur'
            subject: "Mail : test unitaire ", // sujet du mail 
            html: "test"
        }
        transporter.sendMail(mailOptions, (err, res, next) => {
            if (err) {
                res.send(err)
            } else {
                next()
            }
            assert.notEqual(res.accepted, ['expodebrique@gmal.com']) 
            assert.equal(res.rejected, ['expodebrique@gmal.com'])
        });
    });
});
