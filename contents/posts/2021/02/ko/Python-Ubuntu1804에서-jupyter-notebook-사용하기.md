---
author: millo
title: "[Python] Ubuntu:18.04 에서 jupyter notebook 사용하기"
category: python
layout: post
released_at: 2021-02-04 14:00
updated_at:
image: ../../../../images/category/python.png
series: none
lang: ko
tags:
    - jupyter-notebook
    - python
    - ubuntu
    - 자동 실행
is_private: false
translation:
translation_series: none
description: "Ubuntu:18.04에서 juypter notebook을 설치하고 실행해보자."
---

## 1. 서론

빠른 개발을 원하는 환경에서는 jupyter notebook을 사용하는 경우가 많다. 워낙 편리하기도 하고 직접 AWS 같은 서비스를 사용할 때도 콘솔로 접속하지 않아도 사용할 수 있기 때문이다. 물론, 개발 단계에서는 이렇게 사용하지만 운영 단계에서는 jupyter notebook은 이용하지 않는 게 좋다. 보안에 취약점이 될 수 있기 때문인데, 물론 보안에 그만큼 신경을 쓴다면 써도 괜찮지 않을까 하는 생각이 든다. 그럼 Ubuntu:18.04 환경에서 jupyter notebook을 설치하는 방법에 대해 알아보자.

## 2. jupyter notebook 설치

```bash
## 주피터 노트북 설치
sudo apt-get update
sudo apt-get install python3-pip -y
sudo pip3 install notebook
```

## 3. jupyter notebook 비밀번호

### 3-1. 비밀번호 생성

```bash
## python3 실행
python3
```

```python
## password 생성하기
from notebook.auth import passwd
passwd()
## 비밀번호, 비밀번호 확인 입력
## 아래의 해쉬값 복사해두기
'argon2:$argon2id$v=19$m=10240,t=10,p=8$6hkQhMjIksFnWks634673Q$pVadTdU8T6f+qhHDVIdHBA'
```

### 3-2. jupyter notebook 환경 설정 파일 생성 및 수정

```bash
## 환경 설정 파일 생성
jupyter notebook --generate-config

## 환경 설정 파일 수정
sudo vi /home/ubuntu/.jupyter/jupyter_notebook_config.py

## 파일 맨 아래로 이동 후 아래 코드 작성
c = get_config() ## 환경설정 변수 생성
## 위에서 생성한 해쉬값 입력
c.NotebookApp.password = u'argon2:$argon2id$v=19$m=10240,t=10,p=8$6hkQhMjIksFnWks634673Q$pVadTdU8T6f+qhHDVIdHBA'
c.NotebookApp.ip = '172.31.47.180' ## 아이피 주소입력
c.NotebookApp.notebook_dir = '/' ## 주피터 노트북이 사용할 디렉토리 경로
```

## 4. jupyter notebook 실행 후 백그라운드 모드로 실행

```bash
sudo jupyter-notebook --allow-root
ctrl + z
bg
disown -h
```

## 5. 재부팅 시 jupyter notebook 자동 실행

```bash
which jupyter-notebook ## 실행파일 위치 찾기
/etc/systemd/system/jupyter.serivce

## 아래의 코드 작성 후 저장
[Unit]
Description=Jupyter Notebook Server

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/bin/sudo /usr/local/bin/jupyter-notebook --allow-root --config=/home/ubuntu/.jupyter/jupyter_notebook_config.py

[Install]
WantedBy=multi-user.target

## 위의 코드 저장 후
## jupyter notebook 재실행
sudo systemctl daemon-reload
sudo systemctl enable jupyter
sudo systemctl start jupyter
sudo systemctl status jupyter
sudo systemctl restart jupyter
```

## 6. HTTPS TLS/SSL 인증을 원하는 경우

[이 포스팅](https://millo-L.github.io/Ubuntu-18.04에서-letsencrypt-HTTPS-환경구축/)을 방문해서 letsencrypt를 이용한 HTTPS를 구성하고 NGINX를 리버스 프록시로써 jupyter notebook와 연결해서 사용하면 된다.

## [참고]

-   https://www.youtube.com/watch?v=VrVJWwk1YyQ
