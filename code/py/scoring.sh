#!/bin/bash
USER=$1
PROBLEM=$2
LANGUAGE=$3
SUBMIT=$4
STDOUTLIMIT=$5

# for d in ./code/$PROBLEM/input/*;
# do timeout 3 python ./code/$PROBLEM/$USER/$SUBMIT.py < $d | head -n $STDOUTLIMIT 2>&1; 
# # do timeout -k 3 python ./code/$PROBLEM/$USER/$SUBMIT.py < $d; 
# echo $?;
# if [ $? -eq 124 ]; then echo TIME OUT; else echo {EOF}; fi
# done


for d in ./code/$PROBLEM/input/*;
do python3 ./code/submission/$PROBLEM/$USER/$SUBMIT.py < $d | head -n $STDOUTLIMIT ; echo "{EOF}"; echo "{ERR}" >&2;
done
