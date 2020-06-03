const cookieParser = require('cookie-parser')


module.exports = {
    post: async (req, res) => {
        const date = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        if(req.body.cookieGA){
            res.cookie('rememberGA', 'GoogAnal',{ expires: date} )
        } else {
            res.clearCookie('rememberGA')
        }
        
        res.cookie('rememberToast', 'RT', { expires: date})
        res.redirect('back')
    }
}