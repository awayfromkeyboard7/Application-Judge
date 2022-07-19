const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const uuid = require('uuid');

const extension = {
  'Python': 'py',
  'JavaScript': 'js',
  'C': 'c',
  'C++': 'cpp',
  'Java': 'java'
}

async function createExecFile(userId, problemId, lang, code) {
  
  const dir = `./code/${problemId}/${userId}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true
    });
  }

  const filename = uuid.v4();
  fs.writeFileSync(`${dir}/${filename}.${extension[lang]}`, code, function(err) {
    if (err !== null) {
      console.log(`Fail to create file ${err.code}`);
      return false;
    }
  })
  return filename;
}

async function execCode(userId, problemId, lang, filename) {

  /* 미리 구해놓은 정답 파일 크기의 2배를 넘어가면 출력초과 */

  // const CMD = `sudo docker run --rm -i \
  //               -v $(pwd)/code/${problemId}/input:/code/${problemId}/input \
  //               -v $(pwd)/code/${problemId}/${userId}:/code/${problemId}/${userId} \
  //               -v $(pwd)/code/${lang}:/code/${lang} \
  //               -e USER=${userId} -e PROBLEM=${problemId} -e LANGUAGE=${lang} -e SUBMIT=${filename} \
  //               -e STDOUTLIMIT=20 \
  //               judge:${lang}`

  // USER=$1
  // PROBLEM=$2
  // LANGUAGE=$3
  // SUBMIT=$4
  // STDOUTLIMIT=$5
  const CMD = `bash ./code/${lang}/scoring.sh ${userId} ${problemId} ${lang} ${filename} 20`
  
  const result = await exec(CMD);
  // console.log('judge result:::::', result);
  const results = result.stdout.toString().split("{EOF}\n").slice(0, -1);
  return results;
}

async function compareOutput(problemId, userOutput) {
  const outputDir = fs.readdirSync(`./code/${problemId}/output`, 'utf-8');
  const results = [];
  for (let i = 0; i < outputDir.length; i++) {
    results.push(userOutput[i].trim() === fs.readFileSync(`./code/${problemId}/output/${outputDir[i]}`).toString().trim())
  }
  return results;
}

async function deleteFile(userId, problemId, lang, filename) {
  const dir = `./code/${problemId}/${userId}`;
  await fs.unlink(`${dir}/${filename}.${extension[lang]}`, function(err) {
    if (err !== null) {
      console.log(`Fail to delete file ${err.code}`);
      return false;
    }
  })
  return true;
}

async function judgeCode(userId, problemId, lang, code) {
  console.log(userId, problemId, lang, code);
  if (userId === undefined || userId === '' || problemId === undefined || lang === undefined || code === undefined) {
    return {
      results: [],
      passRate: [],
      msg: [`you passed undefined params!!! userId: ${userId}, problemId: ${problemId}, lang: ${lang}, code: ${code}`]
    };
  }
  const filename = await createExecFile(userId, problemId, lang, code);
  const output = await execCode(userId, problemId, extension[lang], filename);
  const results = await compareOutput(problemId, output);
  await deleteFile(userId, problemId, lang, filename);
  // console.log('code results: ', results);
  // console.log('code output: ',  output);

  let passRate = results.reduce((a, b) => a + b, 0);
  passRate = passRate / results.length * 100;

  return {
    results,
    passRate,
    msg: output
  };
}

module.exports = judgeCode;
