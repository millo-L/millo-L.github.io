---
author: millo
title: "[Docker] Jenkins in Docker(Ubuntu18.04)"
category: docker
layout: post
released_at: 2021-01-18 17:00
updated_at:
image: ../../../../images/category/docker.png
series: none
lang: ko
tags:
    - docker
    - jenkins
    - ubuntu
is_private: false
translation: /jenkins-in-docker-ubuntu/
translation_series: none
description: Docker in Docker로 jenkins docker를 만들어 CI/CD 환경을 만들어보자.
---

# 1. 서론

jenkins는 배포 자동화를 구현할 때 인기 있는 CI/CD 툴이다. 글쓴이도 몇 달 전 AWS 배포 자동화를 구현할 때 jenkins를 써본 적이 있는 데, Docker in Docker로 jenkins를 구현해보면 어떨까해서 진행해봤는 데 나름 괜찮은 것 같아 이 포스팅을 남긴다. 이 포스팅은 **ubuntu18.04 버전에서 구현**된 내용을 작성하는 것이므로 **다른 os에 대해서는 조금씩 수정**해서 쓰길 바란다.

# 2. 구현 방법

## 2-1. jenkins docker 실행

우선 jenkins의 docker image를 가져온다. 이후 8080 외부 포트로 젠킨스를 연동하고, volume을 공유한다. 여기서 docker.sock을 공유하는 이유는 **도커 안에 있는 젠킨스가 내부 도커를 실행할 때 외부에서 실행되는 효과**를 주기 위해서다.

```bash
docker pull jenkins
docker run -d -p 8080:8080 -v /home/ubuntu/jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -u root --name jenkins-practice jenkins
```

이후에 jenkins docker의 log를 확인해서 비밀번호를 알아낸다.

```bash
docker logs jenkins-practice
```

---

## [모듈 설치 오류 시]

이 때 젠킨스 사이트에서 **필요한 모듈들을 설치하게 되는 데 설치 오류가 뜨는 경우가 많다.** 이럴 때는 **jenkins의 버전을 업데이트** 해야한다.

```bash
# root 권한으로 jenkins docker에 접속
docker exec -it -u 0 jenkins-practice /bin/bash
# jenkins 최신 버전 설치
wget http://updates.jenkins-ci.org/download/war/latest/jenkins.war
mv ./jenkins.war /usr/share/jenkins/
chown jenkins:jenkins /usr/share/jenkins/jenkins.war
exit
# jenkins docker 재시작
docker restart jenkins
# log에서 다시 비밀번호 확인 후 재접속
docker logs jenkins-practice
```

---

## 2-2. jenkins docker 내부에 docker 설치

모듈 설치를 완료했으면 외부 docker와 연결할 **jenkins docker 내부의 도커를 설치한다.**

```bash
docker exec -it jenkins-practice /bin/bash
curl -fsSLO https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz
tar xzvf docker-17.04.0-ce.tgz
mv docker/docker /usr/local/bin
rm -r docker docker-17.04.0-ce.tgz
docker login
#아이디 입력
#비밀번호 입력
```

# 3. 느낀 점

docker in docker 자체가 이해하고 나면 그다지 어렵지 않은 부분이어서 구현하는 데 큰 어려움은 없었다. 다만, jenkins 모듈 설치에서 업데이트 하는 방법을 좀 헤매면서 구글링을 하고 해답을 찾게 됐다. 혹여나 도커 인 도커로 jenkins를 구현하고자 하는 사람들에게 이 포스팅이 도움이 됐으면 좋겠다.

# [참고]

-   https://mocadev.tistory.com/38
