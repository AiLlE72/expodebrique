//Import module

const Handlebars = require("handlebars");
const exphbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSession = require('express-session')
const MongoStore = require('connect-mongo');
const helpers = require('handlebars-helpers');



// Constante
const app = express()
const key = require('./api/config')
const urlDB = key.urlDBcloud //key.urlDBlocal
const port = process.env.PORT || 3000
const mongoStore = MongoStore(expressSession)


// Handlebars
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');

//Moment
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);
var moment = require('moment');
moment.locale('fr')


// Method-Override
app.use(methodOverride('_method'));

// Body Parser 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//express-handlebars
app.use('/assets', express.static('publics'))



// Mongoose
mongoose.connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});


// Express-session
app.use(expressSession({
    secret: 'securite',
    name: 'galette',
    saveUninitialized: true,
    resave: false,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

//Définition du res.locals
app.use('*', (req, res, next) => {
    if (req.session) {
        res.locals.name = req.session.name
        res.locals.isVerified = req.session.isVerified
        res.locals.isAdmin = req.session.isAdmin
    } 
    next()    
})

/******** HELPERS **********/
//compteur d'objet
Handlebars.registerHelper("counter", function (db) {
    if (!Array.isArray(db)) { return [] }
    return db.length
});

//
function changeFunc() {
    var selectBox = document.getElementById("selectBox").value;
    console.log('coucou')
    console.log(selectBox)
    return(selectBox);   
}

Handlebars.registerHelper('filterdep', function (selectBox) {
    
    if (this.departement == selectBox) {
        return this;
    }
})


// Router
const router = require('./api/router')
app.use("/", router)


// Port
app.listen(port, function () {
    console.log("Le serveur tourne sur le port : " + port);
})