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
        callback(null, Date.now() + name ); // reconstruit le nom du fichier
    }
});

const upload = multer({ storage: storage });

// Import de controllers
const home = require('./controllers/home')
const inside = require('./controllers/inside')
const admin = require('./controllers/admin')
const verifMail = require('./controllers/verifMail')

//import de middleware
const auth = require('./middleware/auth')

/******** PAGE ACCUEIL **********/
// Home
router.route('/')
    .get(home.get)
    .post(home.post)

/******** PAGE INSIDE **********/    
//Inside
router.route('/inside')
    .get(auth, inside.get)
    .post(upload.single('picture'), inside.post) // upload.single permet de faire le req.file !!!
    .delete(inside.deleteAll)

    //logout
    router.route('/logout')
    .get(inside.logout)

/******** PAGE ADMIN **********/   
router.route('/admin')
    .get(auth, admin.get)

router.route('/inside/:id')
    .put(upload.single('picture'), inside.put)
    .delete(inside.delete)

/******** PAGE verifMail **********/ 

// Nodemailer verif 
router.route('/verify/:id')
    .get(inside.verifMail)
// verifMail
router.route('/verifMail')
    .get(verifMail.get)


module.exports = router