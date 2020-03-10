/************
 * Router.js*
 ************/

// Import
const express = require('express')
const router = express.Router()
const multer = require("multer")

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
const logout = require('./controllers/home')

//import de middleware
const auth = require('./middleware/auth')

/******** PAGE ACCUEIL **********/
// Home
router.route('/')
    .get(home.get)
    .post(home.post)

// Logout
router.route('/logout')
    .get(home.getLogout)

/******** PAGE visiteur **********/
//createUser
router.route('/createUser')
    .get(createUser.get)
    .post(createUser.post)
    
//createExpo
router.route('/createExpo')
    .get(createExpo.get)
    .post(upload.single('affiche'),createExpo.post)

//dateExpo
router.route('/dateExpo')
    .get(dateExpo.get)

//allExpo
router.route('/allExpo')
    .get(allExpo.get)

//locationExpo
router.route('/locationExpo')
    .get(locationExpo.get)

//contact
router.route('/contact')
    .get(contact.get)

/******** PAGE verifMail **********/
// Nodemailer verif 
router.route('/verify/:id')
    .get(createUser.verifMail)

//verifMail
router.route('/verifMail')
    .get(verifMail.get)

/******** PAGE Admin **********/
//Admin
router.route('/admin')
    .get(admin.get)

//listContact
router.route('/listContact')
    .get(listContact.get)

//listUser
router.route('/listUser')
    .get(listUser.get)

router.route('/listUser/:id')
    .put(listUser.put)
    .delete(listUser.delete)


module.exports = router