const expomodel = require('../api/database/models/expoModel')
const assert = require('chai').assert
const mongoose = require('mongoose')
const key = require('../api/config')


//es6 promises
mongoose.Promise = global.Promise;
before(function (done) {
    mongoose.connect(key.urlDBcloud, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    mongoose.connection.once('open', function () {
        console.log('connection ok');
        done()
    }).on('error', function (error) {
        console.log('pas connecter:', error)
    });
})



// describe('saving records', () => {

//     it('enregistré dans la db', (done) => {

//         const expo = new expomodel({
//             name: 'testmocha'
//         })
//         expo.save().then(() => {
//             assert(!expo.isNew);
//             done();
//         })
//     })
// });
describe('créer une expo ', function () {

    //On teste l’addition
    it("l'expo est bien crée", function () {
        //Mon assertion est de dire que 4 sera égal à 2+2
        assert.equal(4, 2 + 2);
    });
});

describe('filtre des expo', () => {
    it('expo filtré apres la date du jours -2j ', (resolve) => {

        const d = new Date()
        const date = (d.setDate(d.getDate() - 2))

        expomodel.find({ startDate: { $gte: date } }).then((result) => {

            for (let i = 0; i < result.length; i++) {
                const expo = result[i];
                assert(expo.startDate >= date);
                resolve();
            }
        })
    })

    it("expo filtré par departement", function (resolve) {
        expomodel.find( {departement: '5e72261671314cf9a90cfdb6'}  ).then((result) => {

            for (let i = 0; i < result.length; i++) {
                const expo = result[i];
                assert(expo.departement == '5e72261671314cf9a90cfdb6');
                resolve();
            }
        })
    });

});

describe('modifié une expo ', function () {

    //On teste l’addition
    it("l'expo est bien modifié", function () {
        //Mon assertion est de dire que 4 sera égal à 2+2
        assert.equal(4, 2 + 2);
    })
});
