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
    const data1 = data.data

    var T = [];
    data1.forEach(element => {
      T.push(element.temperature)
    });
    console.log(T)
    var Time = [];
   
    var H=[]
    data1.forEach(element => {
      H.push(element.humidity)
    });
    // res.send(data)
    res.render('histroy',{temp:`${T}`,humi:`${H}`,time:`${Time}`})
  })
  
});

module.exports = router;
