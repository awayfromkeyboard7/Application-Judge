require("dotenv").config();
const fs = require("fs");
const { spawnSync } = require("child_process");
const { totalInputDict, totalOutputDict } = require("./loadText");
const uuid = require("uuid");

const extension = {
  Python: "py",
  JavaScript: "js",
  C: "c",
  "C++": "cpp",
  Java: "java",
};

const command = {
  Python: "python3",
  JavaScript: "node",
  C: "c",
  "C++": "cpp",
  Java: "java",
};

async function createExecFile(userId, problemId, lang, code) {
  const dir = `./code/submission/${problemId}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }

  const filename = uuid.v4();
  fs.writeFileSync(
    `${dir}/${filename}.${extension[lang]}`,
    code,
    {'mode': 0o755},
    function (err) {
      if (err !== null) {
        console.log(`Fail to create file ${err.code}`);
        return false;
      }
    }
  );
  return filename;
}

async function execCode(userId, problemId, lang, filename) {
  const srcfile = `./code/submission/${problemId}/${filename}.${extension[lang]}`;
  const outputs = [];
  const errors = [];
  for (let i = 0; i < totalInputDict[problemId].length; i++) {
    const child = spawnSync(command[lang], [srcfile], {
      input: totalInputDict[problemId][i],
      /* 미리 구해놓은 정답 파일 크기의 3배를 넘어가면 출력초과 */
      maxBuffer: Math.max(totalOutputDict[problemId][i].length * 2, 1000),
      /* timeout 3s */
      timeout: 3000,
      /* excute with guest permissions */
      uid: parseInt(process.env.UID),
    });
    // 시간초과, 출력초과 처리
    if (child.error) {
      const error = child.error.toString().split(" ")[3];
      if (error === 'ENOBUFS') outputs.push("출력초과");
      else if (error === 'ETIMEDOUT') outputs.push("시간초과");
      else outputs.push(child.error.toString().split(" ")[3]);
      continue;
    }
    if (child.stdout) {
      outputs.push(child.stdout.toString().trim());
      const error = child.stderr.toString();
      if (child.stderr.length > 0) {
        const errLog = [];
        for (e of error.split("\n")) {
          if (e.includes("Error")) {
            errLog.push(e);
          }
        }
        errors.push(errLog.join("\n"));
      }
    }
  }
  return { outputs, errors };
}

async function compareOutput(problemId, userOutput) {
  const results = [];
  try {
    for (let i = 0; i < totalOutputDict[problemId].length; i++) {
      results.push(userOutput[i].trim() === totalOutputDict[problemId][i]);
    }
    return results;
  } catch (e) {
    console.log("compare output error", e);
  }
}

async function deleteFile(userId, problemId, lang, filename) {
  const dir = `./code/submission/${problemId}/`;
  fs.unlink(`${dir}/${filename}.${extension[lang]}`, function (err) {
    if (err !== null) {
      console.log(`Fail to delete file ${err.code}`);
      return false;
    }
  });
  return true;
}

async function judgeCode(userId, problemId, lang, code) {
  try {
    if (
      userId === undefined ||
      userId === "" ||
      problemId === undefined ||
      lang === undefined ||
      code === undefined
    ) {
      return {
        results: [],
        passRate: [],
        msg: [
          `you passed undefined params!!! userId: ${userId}, problemId: ${problemId}, lang: ${lang}, code: ${code}`,
        ],
      };
    }
    const filename = await createExecFile(userId, problemId, lang, code);
    const { outputs, errors } = await execCode(
      userId,
      problemId,
      lang,
      filename
    );
    const results = await compareOutput(problemId, outputs);
    await deleteFile(userId, problemId, lang, filename);

    if (errors.length !== 0) {
      return {
        results,
        passRate: 0,
        msg: errors,
      };
    }

    let passRate = results.reduce((a, b) => a + b, 0);
    passRate = (passRate / results.length) * 100;

    return {
      results,
      passRate,
      msg: outputs,
    };
  } catch (e) {
    console.log(e);
    return {
      results: [],
      passRate: -1,
      msg: e,
    };
  }
}

module.exports = judgeCode;
