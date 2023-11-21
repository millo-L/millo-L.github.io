---
author: millo
title: "[Raspberry pi] OpenCV4 설치하기"
category: raspberrypi
layout: post
released_at: 2021-01-25 17:00
updated_at:
image: ../../../../images/category/opencv.jpg
series: none
lang: ko
tags:
    - OpenCV
    - Raspberry Pi
is_private: false
translation: /Install-Opencv-4-on-Raspberry-Pi-4/
translation_series: none
description: Raspberry pi에 OpenCV 4를 설치해보자.
---

## 1. 서론

작년에 [교차로 보행자 안전 알리미 프로젝트](https://www.youtube.com/watch?v=AuWtMnEUwC8&t=1s)를 개발하면서 일반 교차로 CCTV와 비슷한 사양의 영상 데이터를 실시간으로 얻기 위해 라즈베리 파이를 사용한 적이 있다. 카메라 모듈을 통해 촬영한 데이터를 서버 쪽에 TCP 소켓을 통해 전달했는 데 이때 이미지 가공을 위해 사용했던 툴이 OpenCV이다. 다른 많은 블로그들에서 OpenCV 설치를 따라 해 봤지만 매번 Makefile 도중 build과정에서 오류가 나서 다시 포맷을 돌리고 설치하기를 반복한 결과 유일하게 성공한 설치 방법이 있어 포스팅을 한다.

## 2. 설치 방법

> **사전 필요 작업** <br/>
> 당연히 라즈 베리 파이에 라즈비안 os가 설치된 상태라고 가정하고 시작하겠다.

설치 시에는 아래의 순서에 반드시 따라주기 바란다. (~~글쓴이도 띄엄띄엄 따라 하다가 제대로 실행되지 않아 처음부터 다시 시작한 경우도 있다.~~)

```bash
## opencv-4.1.0 압축 파일 설치
wget https://github.com/sol-prog/raspberry-pi-opencv/releases/download/opencv4rpi2.1/opencv-4.1.0-armhf.tar.bz2

## 압축 해제
tar xfv opencv-4.1.0-armhf.tar.bz2

## 압축 해제한 폴더 경로 이동
sudo mv opencv-4.1.0 /opt

## 압축 파일 제거
rm opencv-4.1.0-armhf.tar.bz2

## opencv 사용에 필요한 모듈들 설치
sudo apt install libgtk-3-dev libcanberra-gtk3-dev
sudo apt install libtiff-dev zlib1g-dev
sudo apt install libjpeg-dev libpng-dev
sudo apt install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
sudo apt-get install libxvidcore-dev libx264-dev
sudo apt install python-numpy python3-numpy

## .bashrc 설정
echo 'export LD_LIBRARY_PATH=/opt/opencv-4.1.0/lib$LD_LIBRARY_PATH' >> .bashrc
. .bashrc
sudo ln -s /opt/opencv-4.1.0/lib/python2.7/dist-packages/cv2 /usr/lib/python2.7/dist-packages/cv2
sudo ln -s /opt/opencv-4.1.0/lib/python3.7/dist-packages/cv2 /usr/lib/python3/dist-packages/cv2

## git 설치 및 clone from github
sudo apt install git
git clone https://gist.github.com/sol-prog/ed383474872958081985de733eaf352d opencv_cpp_settings

## settings
cd opencv_cpp_settings
sudo cp opencv.pc /usr/lib/arm-linux-gnueabihf/pkgconfig/

## 폴더 삭제
cd ~
rm -rf opencv_cpp_settings

## opencv 설치 확인
git clone https://github.com/sol-prog/raspberry-pi-opencv
cd raspberry-pi-opencv
cd tests
python3 gui_python_test.py
```

## [참고]

-   https://www.youtube.com/watch?v=1paHdhIC9ug
-   https://gist.github.com/sol-prog/ed383474872958081985de733eaf352d
-   https://github.com/sol-prog/raspberry-pi-opencv
