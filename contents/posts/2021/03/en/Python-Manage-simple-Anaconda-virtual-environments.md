---
author: millo
title: "[Python] Manage simple Anaconda virtual environments기"
category: python
layout: post
released_at: 2021-03-21 19:28
updated_at:
image: ../../../../images/category/anaconda.png
series: none
lang: en
tags:
    - python
    - anaconda
    - env
    - python
is_private: false
translation: /Python-간단한-Anaconda-가상-환경-관리하기/
translation_series: none
description: Let's learn about the Anaconda virtual environment management command that makes python development easier.
---

> **Prerequisite Actions** <br/>
> Of course Python and Anaconda are assumed to be installed.<br/>
> If either is not included, please access each link attached below and download it. <br/> https://www.python.org/downloads/ <br/> https://docs.anaconda.com/anaconda/install/ <br/>

## 1. Create, remove, and activate an Anaconda virtual environment

```bash
## Check anaconda version
conda --version
​
## Update anaconda
conda update conda
​
## Create anaconda virtual environment
## ex) conda create -n Virtual_Environment_Name Packages_to_install
conda create -n example_env python=3.7
​
## Check the list of anaconda virtual environments
conda info --envs
​
## Run a virtual environment
## ex) conda activate Created_Virtual_Environment_Name
conda activate example_env
​
## Remove Virtual Environment
## ex) conda remove -n Created_Virtual_Environment_Name --all
conda remove -n example_env --all
​
## Remove Virtual Environment Cache
conda clean --all
```

​

## 2. Create a list of modules used in an Anaconda virtual environment

python uses requirements.txt to function as the package.json file, the most convenient file that allows the modules used in node.js to be installed and used directly in other users and environments. To do so, you must download the modules required for the development environment and enter the following commands into the terminal.

```bash
pip freeze > requirements.txt
```

​

## 3. List of modules used in anaconda virtual environment Set as it is in another environment

If you need to use collaborative tools such as github to execute Python code developed by another user or in a different environment, Anaconda can create a virtual environment and manage the version between modules that are used in duplicate with other projects. Therefore, you can create a virtual environment with your desired virtual environment name and Python version information, and install modules that match the name and version specified in requirements.txt from the git clone folder.

```bash
pip install -r requirements.txt
```
