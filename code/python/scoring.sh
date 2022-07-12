#!/bin/bash
PROBLEM=$1
USER=$2
SUBMIT=$3

for d in ./code/$PROBLEM/input/*;
do python ./code/$PROBLEM/$USER/$SUBMIT.py < $d 2>&1; echo "{EOF}";
done
