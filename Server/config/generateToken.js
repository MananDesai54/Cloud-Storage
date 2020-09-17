const jwt = require('jsonwebtoken');

module.exports = function(user) {
    const payload = {
        user: {
            id: user.id
        }
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24hr' })
    return token;
}

// ,(err, token) => {
//     if(err) return console.log(err.message)
//     JWTToken = token;
// }