const Cloud = require('../models/cloudModel');

module.exports = async (req, res, next) => {
    const cloud = await Cloud.findOne({
        user: req.user.id
    });
    if (!cloud) {
        return res.status(404).json({
            error: 'Cloud not found !!!'
        })
    }
    req.cloud = cloud
    next();
}