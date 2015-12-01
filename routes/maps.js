var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://mongo:27017/output';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('maps', {title: 'Maps'});
});

router.get('/data', function(req, res, next) {

  var sw = (req.query.sw).split(',');
  var ne = (req.query.ne).split(',');

  var time = new Date().getTime() - 5 * 60 * 1000;

  MongoClient.connect(mongoUrl, function(err, db) {
    db.collection("arrive")
        .find({$and: [
          {"point.lat": {$gt: sw[0]}},
          {"point.lon": {$gt: sw[1]}},
          {"point.lat": {$lt: ne[0]}},
          {"point.lon": {$lt: ne[1]}},
          {cnt_5min: {$gt: 0}},
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
  MongoClient.connect("mongodb://mongo:27017/gennai", function(err, db) {
    db.collection("shop").find().toArray(function(err, docs){
      res.json(docs);
      db.close();
    });
  });
});

router.get('/route', function(req, res, next) {
  res.render('route', {title: 'Route'});
});

router.get('/route/data', function(req, res, next) {

  var sw = (req.query.sw).split(',');
  var ne = (req.query.ne).split(',');
  var time = new Date().getTime() - 3 * 60 * 60 * 1000; // 5hour
  var cnt = req.query.cnt ? parseInt(req.query.cnt, 10) : 1;

  MongoClient.connect(mongoUrl, function(err, db) {
    db.collection("route")
        .find({$and: [
          {cnt: {$gt: cnt}},
//          {time: {$gt: new Date(time)}},
          {"start_point.lat": {$ne: "0"}},
          {"start_point.lon": {$ne: "0"}},
          {"end_point.lat": {$ne: "0"}},
          {"end_point.lon": {$ne: "0"}},
          {$or: [
            {$and: [
              {"start_point.lat": {$gt: sw[0]}},
              {"start_point.lon": {$gt: sw[1]}},
              {"start_point.lat": {$lt: ne[0]}},
              {"start_point.lon": {$lt: ne[1]}}
            ]},
            {$and: [
              {"end_point.lat": {$gt: sw[0]}},
              {"end_point.lon": {$gt: sw[1]}},
              {"end_point.lat": {$lt: ne[0]}},
              {"end_point.lon": {$lt: ne[1]}}
            ]}
          ]}
        ]}).toArray(function(err, docs) {
      res.json(docs);
      db.close();
    });
  });
});

module.exports = router;
