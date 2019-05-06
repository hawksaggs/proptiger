var express = require('express');
var router = express.Router();

const indexController = require('../controller/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/execute', indexController.execute);

module.exports = router;
