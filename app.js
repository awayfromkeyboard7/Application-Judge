const express= require('express');
const cors = require('cors');
const app = express();
const routes = require("./routes/");

const PORTNUM = 3000;
// const Judge = require('./models/judge');

// app.use(express.json());

// // 유저 아이디 / 문제번호 / 제출 언어 / 코드
// app.post('/judge', async function(req, res) {
//   // console.log(req.body);
//   const result = await Judge(req.body['gitId'], req.body['problemId'], req.body['lang'], req.body['code']);
//   res.status(200).json(result);
// })

// app.listen(PORTNUM, () => {
//   console.log(`Listening... ${PORTNUM}`);
// })

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORTNUM, function() {
  console.log(`Server is running... port: ${PORTNUM}`)
})