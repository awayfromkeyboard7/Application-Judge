const fs = require("fs")
const Judge = require("../models/judge");

exports.mainView = function(req, res) {
  fs.readFile("./views/index.html", "utf8", function(err, buf) {
    res.end(buf);
  })
}

exports.judgeCode = async function(req, res) {
  // judge 서버에 채점 요청
  const result = await Judge(req.body['userId'], req.body['problemId'], req.body['lang'], req.body['code']);
  res.status(200).json(result);
}
