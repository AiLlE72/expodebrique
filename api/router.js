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
const success = require('./controllers/success')
const contactorga = require('./controllers/contactorga')
const lostPassword = require('./controllers/lostPassword')
const myAccount = require('./controllers/myAccount')
const cookie = require('./controllers/cookie')


//import de middleware
const isAdmin = require('./middleware/admin')
const isBan = require('./middleware/ban')


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


//myAccount
router.route('/myAccount/:id')
    .get(myAccount.get)
    .put(myAccount.put)
    .delete(myAccount.delete)

//verif mail modifier
router.route('/verifEditMail/:id')
    .get(myAccount.verifEditMail)
    
//createExpo
router.route('/createExpo')
    .get(isBan, createExpo.get)
    .post(isBan, upload.single('affiche'), createExpo.post)

//createExpo/:id
router.route('/createExpo/:id')
    .put(isBan, upload.single('affiche'), createExpo.put)

//dateExpo
router.route('/dateExpo')
    .get(dateExpo.get)

//allExpo
router.route('/allExpo')
    .get(allExpo.get)


//locationExpo
router.route('/locationExpo')
    .get(locationExpo.get)
    .post(locationExpo.post)

//contact
router.route('/contact')
    .get(contact.get)
    .post(contact.post)

//contactorga
router.route('/contactorga/:id')
    .get(isBan, contactorga.get)
    .post(isBan, contactorga.post)

//success
router.route('/success')
    .get(success.get)

/******** Mot de passe perdu **********/
//lostPassword
router.route('/lostPassword')
    .get(lostPassword.get)
    .post(lostPassword.post)
    

//newPassword
router.route('/newPassword/:id')
    .get(lostPassword.getReset)
    .post(lostPassword.postReset)
    


/********** PAGE verifMail *************/
// Nodemailer verif 
router.route('/verify/:id')
    .get(createUser.verifMail)
    

//verifMail
router.route('/verifMail')
    .get(verifMail.get)

/********* PAGE Admin **************/
//Admin
router.route('/admin')
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