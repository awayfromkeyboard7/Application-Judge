#!/bin/bash
USER=$1
PROBLEM=$2
LANGUAGE=$3
SUBMIT=$4
STDOUTLIMIT=$5

for d in ./code/submission/$PROBLEM/input/*;
do timeout 3 node ./code/submission/$PROBLEM/$USER/$SUBMIT.js < $d | head -n $STDOUTLIMIT; echo "{EOF}"; echo "{ERR}" >&2;
done
