#!/bin/bash
USER=$1
PROBLEM=$2
LANGUAGE=$3
SUBMIT=$4

for d in ./code/$PROBLEM/input/*;
do python ./code/$PROBLEM/$USER/$SUBMIT.py < $d 2>&1; echo "{EOF}";
done
