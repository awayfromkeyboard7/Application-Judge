const express= require('express');
const app = express();
const Judge = require('./judge');

const PORTNUM = 3000;

app.use(express.json());

// 제출언어 / 문제번호 / 유저 아이디 / 코드
app.post('/judge', async function(req, res) {
  console.log(req.body['code']);
  const result = await Judge(req.body['code']);
  res.status(200).json(result);
})

app.listen(PORTNUM, () => {
  console.log(`Listening... ${PORTNUM}`);
})