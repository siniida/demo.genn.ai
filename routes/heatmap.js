var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://tf0054_mongo:27017/output';

/* GET Heatmap demo page. */
router.get('/', function(req, res, next) {
  res.redirect('/heatmap/1');
});

router.get('/c', function(req, res, next) {
  res.redirect('/heatmap/c/1');
});

router.get('/:min', function(req, res, next) {
  res.render('heatmap', { title: '[Demo] Heatmap ' + req.params.min + 'min' });
});

router.get('/c/:min', function(req, res, next) {
  res.render('heatmap2', { title: '[Demo] Heatmap ' + req.params.min + 'min (circle)' });
});

/* dataSet */
router.get('/data/:min', function(req, res, next){
  var ids = [
    'CNTQ-W7N25', 'QMG2-ZCGBZ', 'N8TC-JG291', '7PGG-CGR4G', // 1
    'CH81-17ZFQ', 'C14R-914G5', 'N74P-KBAWQ', '8GYP-ZVTT1',
    '8UN6-7PQGW', '3ZQ2-QBR57', 'BKQB-XTCQ5', 'AGJF-8X716', // 2
    'APA6-MUTYF', '9J2X-KNC7F', '5K1Q-YNYAZ', '5MEQ-JYAQF',
    'A6K2-PMXB1', '9M3Z-G2VFZ', '9SXH-5JJMW', 'A789-3ZTXJ', // 3
    'BRX7-KPMWR', '9N2C-VCPC4', 'AMHS-B7ZUZ', '3SSX-VG4FG',
    '5PVH-YXU5X', 'AUX3-4A231', '7HXN-CYFQK', '5WE7-5MT3X', // 4
    'AXSQ-1XSFM', 'CH81-17ZFQ', '8VYY-U7GFP', '9MXB-3W95T',
    'CSB5-UB8YE', 'BZYJ-42XZV', 'BZT4-HWA25', '83CN-88EXA', // 5
    '5GQC-UFUKV', '7WBR-E1N8B', '5GU4-7YQSA', 'BBUT-Q6AZV',
    'AAXV-1F1CA', 'BF2Z-2P6KR', '8KGV-U8BVW', '734C-9RYMJ', // 6
    '71P9-G8N42', '5G1P-J34TG', '6YEQ-7369S', '6YK9-8CNHR',
    'RTGG-N7GH2', '3ZRR-FNT7Q', '3U34-HKHP3', 'CSWZ-SRR57', // 7
    '6VSZ-ZSSRM', 'AA73-RBS53', '8YUC-8RFJP', 'A2HE-JX81F',
    '8UN6-7PQGW', '6VU5-992CJ', '3ZQ2-QBR57', '6VTJ-92XJ4', // 8
    '6VRR-NSWNP', 'CSXZ-3A836', 'EMC3-W3HPN', '76CM-JAFZR'
  ];

  if (req.params.min != 1 && req.params.min != 5 & req.params.min != 15) {
    res.json([]);
    return;
  }

  var now = new Date();

  MongoClient.connect(url, function(err, db) {
    db.collection("arrive" + req.params.min + "min")
        .find({cp_id: {$in: ids}})
        .toArray(function(err, docs) {
      var result = [];
      for (var i = 0; i < ids.length; i++) {
        for (var j = 0; j < docs.length; j++) {
          if (ids[i] == docs[j].cp_id) {
            if (docs[j].time) {
              if (now.getTime() - (new Date(docs[j].time)).getTime() < 5 * 60 * 1000) {
                result.push(docs[j].cnt);
              } else {
                result.push(0);
              }
            } else {
              result.push(0);
            }
            break;
          }
          if (j == docs.length - 1) {
            result.push(0);
          }
        }
      }
      res.json(result);
      db.close();
    });
  });
});

module.exports = router;
