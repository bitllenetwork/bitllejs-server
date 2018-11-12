const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    return res.status(200).json({success: true, message: 'The current version of api http://localhost/api/v1/', data: {}});
});

router.get('/api', function (req, res) {
    return res.status(200).json({success: true, message: 'The current version of api http://localhost/api/v1/', data: {}});
});

module.exports = router;
