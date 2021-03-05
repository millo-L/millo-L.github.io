---
author: millo
title: "[Python] 간단한 Anaconda 가상 환경 관리하기"
category: python
layout: post
released_at: 2021-01-26 17:00
updated_at:
image: ../../../../images/category/anaconda.png
series: none
lang: ko
tags:
    - python
    - anaconda
    - env
    - python
is_private: false
translation:
translation_series: none
description: python 개발을 편리하게 해주는 Anaconda 가상 환경을 관리 명령어에 대해 알아보자.
---

> **전제 조건** <br/>
> 당연히 Python과 Anaconda는 깔려있다고 가정한다.<br/>
> 혹시나 둘 중 하나가 깔려있지 않다면, 아래에 첨부한 각각의 링크에 접속해서 다운로드하기 바란다. <br/> https://www.python.org/downloads/ <br/> https://docs.anaconda.com/anaconda/install/ <br/>

# 1. Anaconda 가상 환경 생성, 제거, 활성화

```bash
# anaconda 버전 확인
conda --version
​
# anaconda 업데이트
conda update conda
​
# anaconda 가상 환경 생성
# ex) conda create -n 가상_환경_이름 설치할 패키지
conda create -n example_env python=3.7
​
# anaconda 가상 환경 목록 확인
conda info --envs
​
# 가상 환경 실행
# ex) conda activate 생성한_가상_환경_이름
conda activate example_env
​
# 가상 환경 제거
# ex) conda remove -n 생성한_가상_환경_이름 --all
conda remove -n example_env --all
​
# 가상 환경 캐시 제거
conda clean --all
```

​

# 2. Anaconda 가상 환경에서 사용한 모듈 목록 생성

node.js에 사용한 모듈들을 다른 사용자 및 환경에서 바로바로 설치해서 사용할 수 있게 해주는 가장 편리한 파일인 package.json 파일의 기능을 python에서는 requirements.txt가 한다. 그러기 위해서는 개발환경에 필요한 모듈들을 다운로드한 후 아래의 명령어를 터미널에 입력해야 한다.

```bash
pip freeze > requirements.txt
```

​

# 3. Anaconda 가상 환경에서 사용한 모듈 목록 다른 환경에서 그대로 세팅하기

만약, github 등의 협업 툴을 이용해서 다른 사용자가 개발한 혹은 다른 환경에서 개발한 python 코드를 실행해야 한다면, Anaconda에서 가상 환경을 만들어서 다른 프로젝트와 중복해서 사용하는 모듈들간의 버전 관리 등을 별도로 진행할 수 있다. 따라서, 자신의 원하는 가상 환경 이름과 python의 버전 정보로 가상 환경을 만든 후, git clone 받은 폴더에서 requirements.txt에 명시된 이름과 버전에 맞는 모듈들을 설치하면 된다.

```bash
pip install -r requirements.txt
```
