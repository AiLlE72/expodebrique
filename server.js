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
const cron = require('node-cron')



// Constante
const app = express()
const key = require('./api/config')
const urlDB = key.urlDBcloud //key.urlDBlocal
const port = process.env.PORT || 3000
const mongoStore = MongoStore(expressSession)
const emailing = require('./api/emailing')
const deleteArchive= require('./api/deleteArchive')


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
        res.locals.userId = req.session.userId
        res.locals.name = req.session.name
        res.locals.isVerified = req.session.isVerified
        res.locals.isAdmin = req.session.isAdmin
        res.locals.email = req.session.email
    }
    next()
})


/******** HELPERS **********/
//compteur d'objet
Handlebars.registerHelper("counter", function (db) {
    if (!Array.isArray(db)) { return [] }
    return db.length
});

//tri par date
Handlebars.registerHelper("sortByDate", function (db) {
    if (!Array.isArray(db)) { return [db] }
    db.sort(function (a, b) {
        return new Date(a.startDate) - new Date(b.startDate)
    })
    return db
});

// limitation taille text message
Handlebars.registerHelper('truncate', function (str, len) {
    if (str != null && str.length > len && str.length > 0) {
        return new Handlebars.SafeString(str.substring(0, len) + '...');
    }
    return str;

});

//inversion objet de db
Handlebars.registerHelper('reverse', function (arr) {
    if (!Array.isArray(arr)) { return []; }
    return arr.reverse();
});

//controle de l'auteur des cards
Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

// Router
const router = require('./api/router')
app.use("/", router)

// Error404
app.use((req, res) => {
    res.render('error404')
})

// Port
app.listen(port, function () {
    console.log("Le serveur tourne sur le port : " + port);
})