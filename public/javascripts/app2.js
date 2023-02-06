import * as mqtt from "mqtt";
import express from 'express';
import { engine } from 'express-handlebars';
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("./views/"));

app.get('/', (req, res) => {
  res.render('index')
});//主頁面顯示index.ejs 檔案位置在views/index.ejs


app.get('/api/data', (req, res) => {
  res.json({ temp: T, humi: H })
})

app.listen(3002, () => {
  console.log('server is work')
});