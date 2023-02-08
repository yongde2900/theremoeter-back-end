var express = require('express');
var axios =require('axios')
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/histroy', function(req, res, next) {
  axios.get('http://192.168.168.155:3000/api/datas?limit=20')
  .then(data=>{
    res.render('histroy',{temp:`${data.data.temprature}`})
  })
  
});

module.exports = router;
