const router = require('express').Router();
const controller = require("./controller");

// 메인화면
router.get("/", controller.mainView);

// 채점 서버
router.post('/judge', controller.judgeCode);


module.exports = router;