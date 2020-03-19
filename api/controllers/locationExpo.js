const expomodel = require('../database/models/expoModel')


module.exports = {
    get: async (req, res) => {
        const date = new Date()
        const dbdep = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        // const dbdepartement = await depmodel.find({})
        const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        res.render('locationExpo', { dbexpo, dbdep })
        // const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement").exec((err, Dbexpo) => {
        //     if (err) {
        //         console.log(err)
        //         res.send(err)
        //     } else {
        //         res.render('locationExpo', { Dbexpo, dbdep, dbdepartement })
        //     }
        // })


    },
    post: async (req, res) => {
        const date = new Date()
        const dbdep = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
        const dep = req.body.departement

        console.log(dep)
        if (dep === "all") {
            const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement")
            res.render('locationExpo', { dbexpo, dbdep })
        } else {

            const dbexpo = await expomodel.find({ startDate: { $gte: date } }).populate("departement", {
                select: '_id',
                match: {  _id : 'dep' }
            }).exec()

            console.log(db)
            console.log(dbexpo);
            console.log(dep);


            res.render('locationExpo', { dbexpo, dbdep })
        }
    }
}