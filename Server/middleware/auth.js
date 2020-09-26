const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({
            error: 'Not authorized'
        });
    }

    try {
        
        const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
        req.user = decoded.user;
        return next();

    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            error: 'Not valid token.'
        })
    }
}