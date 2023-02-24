# theremoeter-back-end

## 專案介紹 
由樹梅派連接DHT11溫溼度感測器接收資料，將資料上傳firebase資料庫，並由前端讀取API資料即時呈現給使用者。
## 運行環境需求
此專案需要Node.js
## 專案執行步驟
在專案資料夾下git clone此Repo，並且將CMD指到此專案資料夾使用下列指令
`npm run start`
在瀏覽器開啟localhost:3000即可看到此專案內容。
## 支援
EJ 座位:Jimmy的右邊 k0970133227@gmail.com

Jimmy 座位:EJ的左邊 com414141@gmail.com

Bin 座位:Jimmy的左邊 k1234988@gmail.com
## API
獲取資料的API分為三個時間頻率

quarter:十五分鐘一筆，一次抓取4筆

hour:一小時一筆，一次抓取24筆

day:一天一筆，一次抓取7筆
