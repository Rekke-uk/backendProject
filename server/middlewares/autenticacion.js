let verficaToken = (req, res, next) => {
    let token = req.get('token')
    res.json({
        token: token
    })
}

module.exports = {
    verficaToken,
}