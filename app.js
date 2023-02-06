import * as mqtt from "mqtt" ;
import express from 'express';
import { engine } from 'express-handlebars';

const app=express();

let option = {
    username: 'user',
    password: '123456'
}
const  TA=[];
const HA=[]
let T=0;
let H=0
let client = mqtt.connect('ws://192.168.168.169:1884', option)
client.on('connect', () => {
    console.log('connected')
    client.subscribe('climate/data')
    client.on('message', (topic, payload) => {
        T= JSON.parse(payload).temperature
         H= JSON.parse(payload).humidity
        TA.push(T);
        HA.push(H);
        console.log(T)
        return{
          T,H
        }

    })
})
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
res.render('index', {ji:H,jo:T})
 
});

app.get('/api/data', (req,res) => {
  res.json({temp:T,humi:H})
})

app.listen(3001,()=>{
  console.log('server is work')
})