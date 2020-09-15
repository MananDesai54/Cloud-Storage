const router = require('express').Router();

router.get('/', (req,res) => {
    res.send('Cloud');
})

module.exports = router;