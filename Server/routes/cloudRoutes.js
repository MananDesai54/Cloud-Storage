const router = require('express').Router();

const S3 = require('../config/aws');

router.get('/', (req,res) => {
    res.send('Cloud');
});

// S3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: 'billyImage.jpg' }).promise().then((res) => console.log(res));

// S3.listObjectsV2({ Bucket: process.env.AWS_BUCKET_NAME }).promise()
//     .then(res => console.log(res));


module.exports = router;