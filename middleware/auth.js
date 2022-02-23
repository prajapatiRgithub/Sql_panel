const jwt = require('jsonwebtoken');
const config = require('config');

const generateAuthToken = (req, res, next) => {

    const token = jwt.sign({ Email: req.body.Email }, config.get('jwtPrivateKey'));
    res.cookie("jwt", token);
    next();
}

const autheticate = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token == undefined) {
            return res.send("not defined");
        }
        const decode = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decode;
        next();
    } catch (err) {
        logger.error('Error', err);
    }
}
module.exports = {
    generateAuthToken,
    autheticate
};