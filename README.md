# test frontend

[Reference](https://github.com/anthonyhungnguyen/mnist-recognizer-react)

## 설명

- Mnist, insurance, temperature 에 대한 ML model backend 부분을 테스트하기위한 react frontend
- 테스트목적으로 만들었기때문에 api요청은 kubernetes service를 이용해서 진행합니다.
  * 따라서 frontend또한 k8s cluster내에서 실행되어야 합니다.
- fastapi server port가 다르다면 package.json 파일 제일 하단에 proxy 부분을 수정하여야 합니다.