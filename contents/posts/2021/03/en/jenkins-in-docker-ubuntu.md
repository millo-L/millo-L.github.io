---
author: millo
title: "[Docker] Jenkins in Docker(Ubuntu18.04)"
category: docker
layout: post
released_at: 2021-03-13 15:10
updated_at:
image: ../../../../images/category/docker.png
series: none
lang: en
tags:
    - docker
    - jenkins
    - ubuntu
is_private: false
translation: /Jenkins-in-Docker-Ubuntu1804/
translation_series:
description: Let's make Jenkins docker with Docker in Docker and create a CI/CD environment.
---

## 1. Introduction

Jenkins is a popular CI/CD tool when implementing deployment automation. I also used Jenkins a few months ago when implementing AWS distribution automation, and I thought it would be good to implement Jenkins with Docker in Docker, but I leave this post because I think it's okay.

**This posting is to write the implementation in ubuntu18.04 version, so please revise the other os little by little.**

## 2. How to Implement

### 2-1. jenkins docker

First, get Jenkins' docker image. Afterwards, Jenkins is connected to the 8080 external port and volume is shared. The reason why we share docker.sock here is to give Jenkins inside the docker the effect of running the docker externally.

```bash
docker pull jenkins
docker run -d -p 8080:8080 -v /home/ubuntu/jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -u root --name jenkins-practice jenkins
```

After that, check Jenkins docker's log to find the password.

```bash
docker logs jenkins-practice
```

---

### [In case of module installation]

At this time, installation errors often occur when necessary modules are installed at the Jenkins site. In this case, we need to update Jenkins' version.

```bash
## Access Jenkins docker with root privileges
docker exec -it -u 0 jenkins-practice /bin/bash
## Install jenkins latest version
wget http://updates.jenkins-ci.org/download/war/latest/jenkins.war
mv ./jenkins.war /usr/share/jenkins/
chown jenkins:jenkins /usr/share/jenkins/jenkins.war
exit
## jenkins docker reboot
docker restart jenkins
## recheck password from jenkins docker's log
docker logs jenkins-practice
```

---

### 2-2. Install docker inside jenkins docker

When the module installation is complete, install the docker inside the jenkins docker to connect with the external docker.

```bash
docker exec -it jenkins-practice /bin/bash
curl -fsSLO https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz
tar xzvf docker-17.04.0-ce.tgz
mv docker/docker /usr/local/bin
rm -r docker docker-17.04.0-ce.tgz
docker login
#input id
#input password
```

## [References]

-   https://mocadev.tistory.com/38
