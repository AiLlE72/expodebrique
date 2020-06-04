/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: (req, res ) => {
        const RT = req.cookies.rememberToast
        const GA = req.cookies.rememberGA
        res.render('mentionsLegales', { RT, GA });
    }
}
