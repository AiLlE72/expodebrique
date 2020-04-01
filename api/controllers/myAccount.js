const usermodel = require('../database/models/userModel')
const depmodel = require('../database/models/depModel')

module.exports = {
    get: async (req, res) => {
        const dbdepartement = await depmodel.find({})
        const user = await usermodel.findOne({email: req.session.email}).populate("departement")

        // console.log(user);
        
        res.render('myAccount', { user } )
           
    }
}

