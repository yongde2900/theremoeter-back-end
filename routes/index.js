var express = require('express');
var axios =require('axios')
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '溫溼度資料站' });
});

router.get('/histroy', function(req, res, next) {

  // let endpoint = [
  //   'http://192.168.168.155:3000/api/datas/hour',
  //   'http://192.168.168.155:3000/api/datas/day',
   
  // ];
  // axios.all(endpoint.map((url)=>axios.get(url))).then((data)=>{
  //   console.log(data.data().temperature_avg)
  // })
  axios.get('http://192.168.168.155:3000/api/datas/?limit=10')
  .then(data=>{
    const data1 = data.data 
    var T = [];
    data1.forEach(element => {
      T.push(element.temperature)
    });
    // console.log(T)
    var Time = [];
    data1.forEach(element => {
      Time.push(`${new Date(element.timestamp).getHours()}+":"+${new Date(element.timestamp).getMinutes()}`)
    });
    var H=[]
    data1.forEach(element => {
      H.push(element.humidity)
    });
    res.render('histroy',{temp:`${T}`,humi:`${H}`,time:`${Time}`})
  })
});

module.exports = router;
