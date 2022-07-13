const fs = require('fs');
let nums = fs.readFileSync('/dev/stdin').toString().split(' ');
console.log(Number(nums[0]) + Number(nums[1]));