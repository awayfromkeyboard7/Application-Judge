const fs = require('fs');

const totalInputDict = {}
const totalOutputDict = {}


async function loadInputTexts() {
    const submissionDir = fs.readdirSync('./code/submission', 'utf-8');
    for (const problemId of submissionDir) {
	if (!problemId.includes('.')) {
        const inputDir = fs.readdirSync(`./code/submission/${problemId}/input`, 'utf-8');
	totalInputDict[problemId] = [];
        for (let i = 0; i < inputDir.length; i++) {
            totalInputDict[problemId].push(fs.readFileSync(`./code/submission/${problemId}/input/${inputDir[i]}`).toString().trim());
        }
        }
    }
}

async function loadAnswerTexts() {
    const answerDir = fs.readdirSync('./code/answer', 'utf-8');
    for (const problemId of answerDir) {
        const outputDir = fs.readdirSync(`./code/answer/${problemId}/output`, 'utf-8');
        totalOutputDict[problemId] = [];
        for (let i = 0; i < outputDir.length; i++) {
            totalOutputDict[problemId].push(fs.readFileSync(`./code/answer/${problemId}/output/${outputDir[i]}`).toString().trim());
        }
    }
}




loadInputTexts()
loadAnswerTexts()

fs.writeFile('./inputs.txt', JSON.stringify(totalInputDict), function(err) {
    if (err) {
        console.log(err);
    }
})

fs.writeFile('./outputs.txt', JSON.stringify(totalOutputDict), function(err) {
    if (err) {
        console.log(err);
    }
})

module.exports = {
    totalInputDict,
    totalOutputDict,
}
