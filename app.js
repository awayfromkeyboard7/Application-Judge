const express= require('express');
const app = express();
const Judge = require('./judge');

const PORTNUM = 4000;

app.use(express.json());

// 유저 아이디 / 문제번호 / 제출 언어 / 코드
app.post('/judge', async function(req, res) {
  console.log(req.body);
  const result = await Judge(req.body['userId'], req.body['problemId'], req.body['lang'], req.body['code']);
  res.status(200).json(result);
})

app.listen(PORTNUM, () => {
  console.log(`Listening... ${PORTNUM}`);
})