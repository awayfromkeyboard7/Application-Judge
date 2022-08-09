const fetch = require("node-fetch");
const fs = require("fs");


const writeStream = fs.createWriteStream('container.csv');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const sendCode = async () => {
  await fetch(`http://43.200.139.195:3000/judge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gitId: "park-hg",
      problemId: "62c973cd465933160b9499c1",
      lang: "Python",
      code: "a, b = map(int, input().split())\nprint(a+b)",
    }),
  })
  .then((res) => {
    if (res.status === 403) {
      router.replace({
        pathname: "/",
        query: { msg: "loginTimeout" },
      });
      return;
    }
    return res.json();
  })
  .then((data) => {
    if (data.success) {
    }
  })
  .catch((error) => console.log("[ERROR] postcode error :", error));
};

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function run(trials) {

  const results = []

  for (let i = 0; i < trials; i++) {
    await delay(1000);
    // Prints about 1000, because the `delay()` calls run in parallel
    const start = Date.now();
    await sendCode();
    const arival = Date.now() - start;
    // console.log(arival);
    results.push(arival);
  }

  Promise.all(results).then(values => {writeStream.write(`${values},`)});
  return results;
}
run(1000);

