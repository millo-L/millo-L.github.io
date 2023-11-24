---
author: millo
title: "[Raspberry pi] 부팅 시 프로그램 자동 실행하기"
category: raspberrypi
layout: post
released_at: 2021-01-27 21:00
updated_at:
image: ../../../../images/category/raspberry.png
series: none
lang: ko
tags:
    - raspberry pi
    - rc.local
    - 자동실행
    - 부팅 시 자동실행
is_private: false
translation:
translation_series:
description: Raspberry pi를 부팅했을 때 프로그램이 자동실행하게 설정해보자.
---

## 1. 서론

작년에 [교차로 보행자 안전 알리미 프로젝트](https://www.youtube.com/watch?v=AuWtMnEUwC8&t=1s)를 개발하면서 일반 교차로 CCTV와 비슷한 사양의 영상 데이터를 실시간으로 얻기 위해 라즈베리 파이를 사용한 적이 있다. 카메라 모듈을 통해 촬영한 데이터를 서버 쪽에 TCP 소켓을 통해 전달했는 데 라즈베리 파이의 전원이 켜짐과 동시에 서버와 TCP 소켓을 연결하고 이미지를 송신하는 부팅 시 자동 실행 기능이 필요했다.

## 2. 방법

방법은 생각보다 정말 간단하다. rc.local 파일을 수정하는 것이다.

```bash
sudo vi /etc/rc.local
```

위의 rc.local파일을 켜면 아래와 같이 기존의 설정들이 기록되어 있다. 여기서 코드의 맨 아랫줄로 가서 exit 0 바로 윗줄에 자신이 실행시키고자 하는 프로그램의 실행 명령어를 작성하면 된다. 여기서 중요한 점은 해당 명령어를 작성해야 하는 위치와 명렁어 맨 뒤에 반드시 &을 붙여야 한다는 것이다.

```bash
#!/bin/sh -e
#
## rc.local
#
## This script is executed at the end of each multiuser runlevel.
## ...
## ...
## ...

## Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
	printf "My IP address is %s\n" "$_IP"
fi

## 여기에 실행하고자 하는 파일의 실행 명령어를 입력하고 뒤에 &을 붙인다.
sudo python3 /home/pi/clientsocket.py &

exit 0
```

실제로 입력한 코드는 아래의 한 줄의 코드가 전부이다.

```bash
sudo python3 /home/pi/clientsocket.py &
```

이렇게 작성한 후 저장을 하고 raspberry pi를 재부팅하고 자동 실행이 되는지 여부를 체크하면 된다.

```bash
sudo reboot
```

**혹시 다른 방식의 자동 실행을 원하는 경우는 아래에 있는 참고 링크를 타고 가길 바란다.**

## [참고]

-   https://m.blog.naver.com/emperonics/221770579539
