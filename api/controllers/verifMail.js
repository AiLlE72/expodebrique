/************************
 *                      * 
 *      Module          *   
 *                      *
 ************************/

module.exports = {
    get: (req, res) => {
        const RT = req.cookies.rememberToast
        const GA = req.cookies.rememberGA
        res.render('verifMail', { RT, GA })
    },
}