const jwt = require('jsonwebtoken');
const tokenKey = '1c2b-3c4d-5a6f-4g8h';

module.exports = function tokenVerify (req, res, next) {

    try {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            tokenKey,
            (err,decoded) => {
                if (err) { return res.send("Log in.")}
                req.decoded = decoded;
                next()
            }
        )
    }

    catch(err) {
         console.log(err);
     }
}