var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Demo' });
});

router.get('/ping', function(req, res, next) {
  res.json({status: "OK"});
});

module.exports = router;
