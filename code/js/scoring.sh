#!/bin/bash
USER=$1
PROBLEM=$2
LANGUAGE=$3
SUBMIT=$4
STDOUTLIMIT=$5

for d in ./code/$PROBLEM/input/*;
do node ./code/$PROBLEM/$USER/$SUBMIT.js < $d | head -n $STDOUTLIMIT; echo "{EOF}"; echo "{ERR}" >&2;
done
