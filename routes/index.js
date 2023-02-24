var express = require('express');
var axios =require('axios')
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '溫溼度資料站' });
});

router.get(`/histroy`  , function(req, res, next) {

  // let endpoint = [
  //   'http://192.168.168.155:3000/api/datas/hour',
  //   'http://192.168.168.155:3000/api/datas/day',
   
  // ];
  // axios.all(endpoint.map((url)=>axios.get(url))).then((data)=>{
  //   console.log(data.data().temperature_avg)
  // })

    res.render('histroy')
  })


module.exports = router;
