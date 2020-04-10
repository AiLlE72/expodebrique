const cookieParser = require('cookie-parser')


module.exports = {
    post: async (req, res) => {
        const date = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        res.cookie('rememberToast', 'RT', { expires: date})
        res.redirect('back')
    }
}