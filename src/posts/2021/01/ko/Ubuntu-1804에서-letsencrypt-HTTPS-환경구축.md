---
author: millo
title: "[NGINX] Ubuntu:18.04에서 letsencrypt HTTPS 환경 구축하기"
category: nginx
layout: post
released_at: 2021-01-28 13:00
updated_at:
image: ../../../../images/category/letsencrypt.png
series: none
lang: ko
tags:
    - NGINX
    - Certbot
    - HTTPS
    - letsencrypt
    - SSL
    - "SSL/TLS"
    - TLS
    - ubuntu
is_private: false
translation:
translation_series: none
description: "Ubuntu:18.04에서 letsencrypt와 certbot을 사용하여 NGINX HTTPS 환경을 구축해보자."
---

# 1. 서론

개발자들이 무료로 HTTPS 환경을 사용할 수 있게 letsenrypt라는 비영리 사이트에서 SSL/TLS 인증서를 제공해준다. SSL/TLS에 관해서는 다음에 포스팅을 하도록 하자. 간단하게 말하자면 클라이언트와 서버가 해당 웹페이지를 이용해서 정보를 주고받을 때 다른 사람이 패킷을 빼돌려도 어떤 정보인지 알아낼 수 있게 암호화는 방식이다. 구현은 생각보다 매우 간단하다. 이 포스팅은 Ubuntu 환경에 맞춰서 작성한 것이므로 운영체제 별로 다를 수 있다.

# 2. 구현

> **전제 조건** <br/>
> 개인이 소유한 도메인이 있다고 가정한다. <br/>
> 만약 도메인을 보유하고 있지 않다면 [여기](https://www.freenom.com/en/index.html?lang=en)를 방문해서 회원가입 후 무료 도메인을 구하기 바란다.

우선은 Ubuntu 환경에 NGINX를 설치한다.

```bash
sudo apt-get update
sudo apt-get install nginx
```

이후에는 NGINX HTTP에 대한 방화벽을 해제한다. (AWS 환경의 경우 외부에 포트를 열지말지를 EC2 보안정책에서 따로 설정할 수 있다.)

```bash
sudo ufw allow 'Nginx HTTP'
```

이제 NGINX의 설정 파일에 아래와 같이 보유하고 있는 도메인 명을 입력하고 저장한다.

```bash
sudo vi /etc/nginx/sites-available/sample
```

```nginx
server {
	listen 80;
	server_name www.domain_name.com domain_name.com;

	...
}
```

NGINX를 재실행한다.

```bash
sudo systemctl restart nginx
```

Certbot을 설치한다.

```bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get install python-certbot-nginx
```

Certbot으로 nginx에 설정한 도메인을 인증하고 HTTPS 인증서를 자동 발급 및 명시한다.

```bash
sudo certbot --nginx -d www.domain_name.com -d domain_name.com
```

Letsencrypt의 SSL/TLS 인증서는 최대 3개월 간 보존되고 파기되므로 수동으로 갱신해야된다는 귀찮음이 있다. 하지만 이 문제를 해결하기 위해서 certbot에서는 자동으로 3개월마다 갱신해주는 자동화 기능을 제공한다.

```bash
sudo certbot renew --dry-run
```

위의 방식을 그대로 따라온다면 무리 없이 letsencrypt의 SSL/TLS 인증서를 발급 받을 수 있을 것이다. HTTPS 웹페이지를 구현해보고 싶은 혹은 구현해야 하는 개발자들에게 이 포스팅이 도움이 됐으면 한다.

# [참고]

-   https://letsencrypt.org/
-   https://certbot.eff.org/
