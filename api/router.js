/************
 * Router.js*
 ************/

// Import
const express = require('express')
const router = express.Router()
const multer = require("multer")
const { check, validationResult } = require('express-validator')

//config multer
const MIME_TYPES = { //type d'image accepté
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './publics/ressources/images') //lieu de stockage des images
    },
    filename: (req, file, callback) => { //nom de stockage de l'image
        const name = file.originalname.split(' ').join('_'); // remplace les espaces du nom de fichier fournit par un underscore
        callback(null, Date.now() + name); // reconstruit le nom du fichier
    }
});

const upload = multer({ storage: storage });

// Import de controllers
const home = require('./controllers/home')
const createUser = require('./controllers/createUser')
const admin = require('./controllers/admin')
const verifMail = require('./controllers/verifMail')
const createExpo = require('./controllers/createExpo')
const dateExpo = require('./controllers/dateExpo')
const allExpo = require('./controllers/allExpo')
const locationExpo = require('./controllers/locationExpo')
const listUser = require('./controllers/listUser')
const listContact = require('./controllers/listContact')
const contact = require('./controllers/contact')
const success = require('./controllers/success')
const contactorga = require('./controllers/contactorga')
const lostPassword = require('./controllers/lostPassword')
const myAccount = require('./controllers/myAccount')
const cookie = require('./controllers/cookie')



//import de middleware
const isAdmin = require('./middleware/admin')
const isBan = require('./middleware/ban')
const auth = require('./middleware/auth')


/******** PAGE ACCUEIL **********/
// Home
router.route('/')
    .get(home.get)
    .post([
        check('email').isEmail(),
        check('password').escape()
    ], home.post)

// Logout
router.route('/logout')
    .get(home.getLogout)

/******** PAGE visiteur **********/
//createUser
router.route('/createUser')
    .get(createUser.get)
    .post([
        check('firstname').exists().isLength({ min: 2 }).trim().escape().withMessage('Votre nom doit contenir au moins 2 caractères'),
        check('lastname').exists().isLength({ min: 2 }).trim().escape().withMessage('Votre prénom doit contenir au moins 2 caractères'),
        check('email').isEmail().withMessage('Veuillez rentrer un email valide'),
        check('departement').escape().isLength({ min: 11 }).withMessage("Merci d'utilisé un choix parmi les départements disponible"),
        check('pays').escape().exists().withMessage("Merci d'utilisé un choix parmi les pays disponible"),
        check('password').matches(/^(?=.{8,}$)/).matches(/(?=.*?[a-z])/).matches(/(?=.*?[A-Z])/).matches(/(?=.*?[0-9])/).matches(/(?=.*?[[!@#$%^*])/).escape().withMessage('Votre mot de passe ne correspond pas aux exigences'),
        check('confpassword').custom((value, { req, loc, path }) => {
            if (value !== req.body.password) {
                // créer une nouvelle erreur sur les mots de passe ne correspondent pas 
                throw new Error("Les mots de passe de correspondent pas");
            } else {
                return value;
            }
        })
    ], createUser.post)


//myAccount
router.route('/myAccount/:id')
    .get(myAccount.get)
    .put([
        check('firstname').escape(),
        check('lastname').escape(),
        check('email').escape(),
        check('departement').escape().isLength({ min: 11 }),
        check('pays').escape()
    ], myAccount.put)
    .delete(myAccount.delete)

//verif mail modifier
router.route('/verifEditMail/:id')
    .get(myAccount.verifEditMail)

//createExpo
router.route('/createExpo')
    .get(isBan, auth, createExpo.get)
    .post(isBan, auth, upload.single('affiche'), [
        check('name').isLength({ min: 2 }).trim().escape().withMessage("Vous avez oublié le nom de l'exposition"),
        check('adress').isLength({ min: 2 }).trim().escape().withMessage("Vous avez oublié l'adresse de l'exposition"),
        check('city').isLength({ min: 2 }).trim().escape().withMessage("Vous avez oublié la ville de l'exposition"),
        check('departement').escape().isLength({ min: 11 }).withMessage("Merci d'utilisé un choix parmi les départements disponible"),
        check('postCode').isLength({ min: 2 }).trim().escape().withMessage("Vous avez oublié le code postal de l'exposition"),
        check('country').isLength({ min: 2 }).trim().escape().withMessage("Vous avez oublié le pays de l'exposition"),
        check('startDate').isISO8601().withMessage("Veuillez selectionner une date de debut"),
        check('endDate').isISO8601().withMessage("Veuillez selectionner une date de fin"),
        check('horaire').isLength({ min: 2 }).trim().escape().withMessage("Vous avez oublié les horaires de l'exposition"),
        check('price').isLength({ min: 2 }).trim().escape().withMessage("Vous avez oublié le tarif de l'exposition"),
        check('contact').isEmail().withMessage('Veuillez rentrer un email valide'),
    ], createExpo.post)

//createExpo/:id
router.route('/createExpo/:id')
    .put(isBan, auth, [
        check('name').escape(),
        check('adress').escape(),
        check('city').escape(),
        check('departement').escape(),
        check('postCode').escape(),
        check('country').escape(),
        check('startDate').escape(),
        check('endDate').escape(),
        check('horaire').escape(),
        check('price').escape(),
        check('contact').escape(),
    ], upload.single('affiche'), createExpo.put)

//dateExpo
router.route('/dateExpo')
    .get(dateExpo.get)

//allExpo
router.route('/allExpo')
    .get(allExpo.get)


//locationExpo
router.route('/locationExpo')
    .get(locationExpo.get)
    .post([check('departement').trim().escape()], locationExpo.post)

//contact
router.route('/contact')
    .get(contact.get)
    .post([
        check('email').isEmail().withMessage('Veuillez rentrer un email valide'),
        check('sujet').escape(),
        check('message').escape()
    ], contact.post)

//contactorga
router.route('/contactorga/:id')
    .get(isBan, auth, contactorga.get)
    .post(isBan, auth, [
        check('email').isEmail().withMessage('Veuillez rentrer un email valide'),
        check('sujet').escape(),
        check('message').escape()
    ], contactorga.post)

//success
router.route('/success')
    .get(success.get)

/******** Mot de passe perdu **********/
//lostPassword
router.route('/lostPassword')
    .get(lostPassword.get)
    .post([
        check('email').isEmail().withMessage('Veuillez rentrer un email valide').custom(value => {
            const usermodel = require('../api/database/models/userModel')
            return usermodel.findOne({ value }).then(user => {
                if (!user) {
                    return Promise.reject("Cet email n'est pas dans notre base");
                }
            })
        })
    ], lostPassword.post)


//newPassword
router.route('/newPassword/:id')
    .get(lostPassword.getReset)
    .post([
        check('password').matches(/^(?=.{8,}$)/).matches(/(?=.*?[a-z])/).matches(/(?=.*?[A-Z])/).matches(/(?=.*?[0-9])/).matches(/(?=.*?[[!@#$%^*])/).escape().withMessage('Votre mot de passe ne correspond pas aux exigences'),
    ], lostPassword.postReset)



/********** PAGE verifMail *************/
// Nodemailer verif 
router.route('/verify/:id')
    .get(createUser.verifMail)


//verifMail
router.route('/verifMail')
    .get(verifMail.get)

/********* PAGE Admin **************/
//Admin
router.route('/noWay')
    .get(isAdmin, admin.get)

//listContact
router.route('/listContact')
    .get(isAdmin, listContact.get)

router.route('/listContact/:id')
    .delete(isAdmin, listContact.delete)

//listUser
router.route('/listUser')
    .get(isAdmin, listUser.get)

router.route('/listUser/:id')
    .put(isAdmin, listUser.put)
    .delete(isAdmin, listUser.delete)

/************** Cookies **************/

router.route('/cookie')
    .post(cookie.post)


module.exports = router