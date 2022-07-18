#!/bin/bash
USER=$1
PROBLEM=$2
LANGUAGE=$3
SUBMIT=$4
STDOUTLIMIT=$5

for d in ./code/$PROBLEM/input/*;
do python ./code/$PROBLEM/$USER/$SUBMIT.py < $d | head -n $STDOUTLIMIT 2>&1; echo "{EOF}";
done
