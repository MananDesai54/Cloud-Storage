const router = require('express').Router();

router.get('/', (req,res) => {
    res.send('Profile');
})

module.exports = router;