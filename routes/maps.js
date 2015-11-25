var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://tf0054_mongo:27017/output';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('maps', {title: 'Maps'});
});

router.get('/data', function(req, res, next) {

  var sw = (req.query.sw).split(',');
  var ne = (req.query.ne).split(',');

  var time = new Date().getTime() - 5 * 60 * 1000;

  MongoClient.connect(mongoUrl, function(err, db) {
    db.collection("arrive5min")
        .find({$and: [
          {"point.lat": {$gt: sw[0]}},
          {"point.lon": {$gt: sw[1]}},
          {"point.lat": {$lt: ne[0]}},
          {"point.lon": {$lt: ne[1]}},
          {cnt: {$gt: 0}},
          {time: {$gt: new Date(time)}}
        ]})
        .toArray(function(err, docs) {
      res.json(docs);
      db.close();
    });
  });

});

router.get('/shop', function(req, res, next) {
  res.render('shop', {title: 'Shop'});
});

router.get('/shop/data', function(req, res, next) {
  MongoClient.connect("mongodb://tf0054_mongo:27017/gennai", function(err, db) {
    db.collection("shop").find().toArray(function(err, docs){
      res.json(docs);
      db.close();
    });
  });
});

module.exports = router;
