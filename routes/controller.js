const fs = require("fs")
const Judge = require("../models/judge");

exports.mainView = function(req, res) {
  fs.readFile("./views/index.html", "utf8", function(err, buf) {
    res.end(buf);
  })
}

exports.judgeCode = async function(req, res) {
  // judge 서버에 채점 요청
  console.log("submit from MAIN SERVER::::::", req.body);
  const result = await Judge(req.body['gitId'], req.body['problemId'], req.body['lang'], req.body['code']);
  res.status(200).json(result);
}
