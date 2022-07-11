#!/bin/bash
PROBLEM=$1
USER=$2
SUBMIT=$3

for d in ./code/$PROBLEM/input/*;
do node ./code/$PROBLEM/$USER/$SUBMIT.js < $d; echo "{EOF}";
done
