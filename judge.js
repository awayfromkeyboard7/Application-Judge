const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const uuid = require('uuid');


// https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js

async function createExecFile(lang, problemId, userId, userCode) {
  // * 받은 코드로 py 파일 생성 
  // ref: https://dydals5678.tistory.com/96
  
  const filename = uuid.v4();
  if (lang === 'python3') {
    await fs.writeFileSync(`./code/${problemId}/${userId}/${filename}.py`, userCode, function(err) {
      if (err !== null) {
        console.log(`Fail to create file ${err.code}`);
        return false;
      }
    })
  }
  return filename;
}

async function execCode(problemId, userId, filename) {
  // * py 파일 실행
  // ref: https://blog.outsider.ne.kr/551
  // ref: https://infotech-2.tistory.com/62
  // ref: https://balmostory.tistory.com/33

  const CMD = `docker run --rm -i -v $(pwd)/code:/code \
                -e PROBLEM=${problemId} -e USER=${userId} -e SUBMIT=${filename} \
                --security-opt seccomp=$(pwd)/code/profile.json judge:py`
  let result = await exec(CMD);
  if (result.stderr) {
    let errCode = result.stderr.toString().split('\n');
    return errCode[3];
  } else {
    const results = result.stdout.toString().split("{EOF}\n").slice(0, -1);
    return results
  }
}

async function compareOutput(problemId, userOutput) {
  const outputDir = fs.readdirSync(`./code/${problemId}/output`, 'utf-8');
  for (let i = 0; i < outputDir.length; i++) {
      if (userOutput[i] != fs.readFileSync(`./code/${problemId}/output/${outputDir[i]}`).toString()) {
        return false;
    }
  }
  return true;
}

async function deleteFile(filename) {
  await fs.unlink(filename, function(err) {
    if (err !== null) {
      console.log(`Fail to delete file ${err.code}`);
      return false;
    }
  })
  return true;
}

async function judgeCode(userCode) {
  const filename = await createExecFile('python3', 'problem2', 'user1', userCode);
  const userOutput = await execCode('problem2', 'user1', filename);
  const result = await compareOutput('problem2', userOutput);

  return {
    result: result,
    msg: userOutput
  };
}

module.exports = judgeCode;