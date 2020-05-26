/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: (req, res ) => {
        const RT = req.cookies.rememberToast
        res.render('privacyPolicies', { RT });
    }
}