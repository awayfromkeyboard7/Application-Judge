# 채점서버 구현 과정
## 초기: 코드 실행시 컨테이너 생성 및 폐기
정답디렉토리를 마운트 하지 않는 것으로 유저가 정답파일 읽는 행위를 차단.<br>
제출 코드는 유저가 선택한 언어에 상관없이 쉘스크립트로 실행.<br>
리눅스 timeout, head커맨드로 시간 초과, 출력 초과 제어.<br>
```javascript
/* 코드실행이 끝난 후 컨테이너 폐기 */
/* 문제 테스트케이스파일 디렉토리, 유저 제출코드, 쉘스크립트 파일을 마운트 */
/* 쉘스크립트 실행에 필요한 환경변수 설정 */
/* "-e STDOUTLIMIT=20" : 버퍼 출력량이 20줄 이상일 경우 출력 초과로 판단 */
/* "judge:${lang}" : 미리 빌드한 언어별 이미지 */
const CMD = `sudo docker run --rm -i \
            -v $(pwd)/code/${problemId}/input:/code/${problemId}/input \
            -v $(pwd)/code/${problemId}/${userId}:/code/${problemId}/${userId} \
            -v $(pwd)/code/${lang}:/code/${lang} \
            -e USER=${userId} -e PROBLEM=${problemId} -e LANGUAGE=${lang} -e SUBMIT=${filename} \
            -e STDOUTLIMIT=20 \
            judge:${lang}`
```
## 중기: node의 spawnSync()를 이용해서 자식프로세스 생성
쉘스크립트를 사용하지 않고, 노드 내에서 커맨드를 실행하는 방식으로 개선.<br>
유저가 선택한 언어 lang에 해당하는 커맨드 command[lang]로 유저가 제출한 코드 srcfile 실행.<br>
전체 문제의 입력파일과 정답파일을 메모리에 상주시킴으로써 매번 파일을 읽어야하는 오버헤드를 개선.<br>
```javascript
const child = spawnSync(command[lang], [srcfile], {
  input: totalInputDict[problemId][i],
  /* 미리 구해놓은 정답 파일 크기의 2배를 넘어가면 출력초과 */
  maxBuffer: Math.max(totalOutputDict[problemId][i].length * 2, 1000),
  /* timeout 3s */
  timeout: 3000,
  /* guest계정으로 해당 프로세스 실행 */
  uid: parseInt(process.env.UID),
});
```
## 후기: 위 로직을 바탕으로 AWS Lambda로 이행
link: https://github.com/awayfromkeyboard7/Application-Judge-Lambda
