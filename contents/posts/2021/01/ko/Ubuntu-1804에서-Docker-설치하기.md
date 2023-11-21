---
author: millo
title: "[Docker] Ubuntu:18.04에서 Docker 설치하기"
category: docker
layout: post
released_at: 2021-01-27 23:00
updated_at:
image: ../../../../images/category/docker.png
series: none
lang: ko
tags:
    - AWS
    - docker
    - docker install
    - EC2
    - ubuntu
    - "ubuntu:18.04"
is_private: false
translation:
translation_series: none
description: "Ubuntu:18.04에서 docker를 설치해보자."
---

## 1. 서론

매번 공식 문서를 찾아서 설치하는 게 귀찮아서 블로그에 포스팅한다. 이게 제대로 동작되지 않으면 다시 공식 문서를 확인해서 수정할 예정이다. 혹시나 나처럼 귀찮은 사람을 위한 포스팅이다.

## 2. 설치

아래의 실행 명령을 순서대로 처리하면 설치가 완료된다.

```bash
sudo apt-get update
sudo apt-get install apt-transport-https
sudo apt-get install ca-certificates
sudo apt-get install curl
sudo apt-get install software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt-get update
sudo apt-cache policy docker-ce
sudo apt-get install docker-ce -y

sudo systemctl status docker #도커 동작확인
```

## [참고]

-   https://docs.docker.com/engine/install/ubuntu/
