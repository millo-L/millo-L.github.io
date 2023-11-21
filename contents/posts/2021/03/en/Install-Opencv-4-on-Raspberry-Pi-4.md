---
author: millo
title: "Install Opencv 4 on Raspberry Pi 4"
category: raspberrypi
layout: post
released_at: 2021-03-21 19:18
updated_at:
image: ../../../../images/category/opencv.jpg
series: none
lang: en
tags:
    - OpenCV
    - Raspberry Pi
is_private: false
translation: /Raspberry-pi에-OpenCV4-설치하기/
translation_series: none
description: "Let's install Opencv 4 on Raspberry pi 4"
---

## 1. Introduction

Last year, when developing [an intersection pedestrian safety notification project](https://www.youtube.com/watch?v=AuWtMnEUwC8&t=1s), Raspberry Pi was used to obtain video data with similar specifications to general intersection CCTVs in real time. The data taken through the camera module was delivered to the server via a TCP socket, and the tool used for image processing was OpenCV. Many other blogs have followed the OpenCV installation, but each time there was an error in the build process during Makefile, so the format was repeated and the installation was repeated, and the only successful installation method was posted.

## 2. How to install

> **Prerequisite Actions** <br/>
> Of course, I'll start by assuming that Raspberry Pi has a Raspbian OS installed.

When installing, make sure to follow the following order. (~~In some cases, I didn't follow the order and started again from the beginning because it didn't work properly.~~)

```bash
## Installing opencv-4.1.0 tar
wget https://github.com/sol-prog/raspberry-pi-opencv/releases/download/opencv4rpi2.1/opencv-4.1.0-armhf.tar.bz2

## Decompression
tar xfv opencv-4.1.0-armhf.tar.bz2

## Move uncompressed folder path
sudo mv opencv-4.1.0 /opt

## remove opencv-4.1.0 tar
rm opencv-4.1.0-armhf.tar.bz2

## Install Modules for Using Opencv
sudo apt install libgtk-3-dev libcanberra-gtk3-dev
sudo apt install libtiff-dev zlib1g-dev
sudo apt install libjpeg-dev libpng-dev
sudo apt install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
sudo apt-get install libxvidcore-dev libx264-dev
sudo apt install python-numpy python3-numpy

## .bashrc settings
echo 'export LD_LIBRARY_PATH=/opt/opencv-4.1.0/lib$LD_LIBRARY_PATH' >> .bashrc
. .bashrc
sudo ln -s /opt/opencv-4.1.0/lib/python2.7/dist-packages/cv2 /usr/lib/python2.7/dist-packages/cv2
sudo ln -s /opt/opencv-4.1.0/lib/python3.7/dist-packages/cv2 /usr/lib/python3/dist-packages/cv2

## Install git and clone from github
sudo apt install git
git clone https://gist.github.com/sol-prog/ed383474872958081985de733eaf352d opencv_cpp_settings

## settings
cd opencv_cpp_settings
sudo cp opencv.pc /usr/lib/arm-linux-gnueabihf/pkgconfig/

## remove folder
cd ~
rm -rf opencv_cpp_settings

## Verify opencv Installation
git clone https://github.com/sol-prog/raspberry-pi-opencv
cd raspberry-pi-opencv
cd tests
python3 gui_python_test.py
```

## [References]

-   https://www.youtube.com/watch?v=1paHdhIC9ug
-   https://gist.github.com/sol-prog/ed383474872958081985de733eaf352d
-   https://github.com/sol-prog/raspberry-pi-opencv
