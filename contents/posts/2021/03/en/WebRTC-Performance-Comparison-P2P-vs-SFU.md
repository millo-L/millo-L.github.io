---
author: millo
title: WebRTC Performance Comparison (P2P vs SFU)
category: webrtc
layout: post
released_at: 2021-03-05 15:30
updated_at:
image: ../../../../images/category/webrtc.png
series: WebRTC theory to practice
lang: en
tags:
    - WebRTC
    - SFU
    - Mesh
    - P2P
    - Media Server
    - Signaling Server
is_private: false
translation: /WebRTC-성능비교-P2P-vs-SFU/
translation_series: /WebRTC-이론부터-실전까지
description: Let's compare 1:NP2P vs SFU performance based on WebRTC's theory.
---

## 1. Introduction

With the last posting, we finished implementing the 1:N video conferencing WebRTC of P2P(Mesh) and SFU methods. The last part of the implementation was always a performance test, so I did a simple performance test. Please understand that the independent space between the server and the client would have been good for the test, but it was impossible under the circumstances.

## 2. Performance Test

### 2-1. Devices

| device |                description                |
| :----: | :---------------------------------------: |
|  CPU   | AMD Ryzen 5 3600 6-Core Processor 3.59GHz |
|  RAM   |                   32GB                    |
|  GPU   |       NVIDIA GeForce RTX 2060 SUPER       |
|   OS   |              Windows 10 Pro               |

### 2-2. Settings

-   **All clients and servers ran on one device.**
-   The 1:N method described above is based on general video conferencing.

### 2-3. Client Side Performance(Chrome browser CPU usage)

-   The CPU share was based on Chrome browser because all clients ran on one device.

| the number of users | P2P/Mesh(Signaling Server) | SFU(Media Server) |
| :-----------------: | :------------------------: | :---------------: |
|          2          |             4%             |        5%         |
|          3          |            10%             |        8%         |
|          4          |            22%             |       9.5%        |
|          5          |            34%             |        18%        |
|          6          |            47%             |        25%        |
|          7          |            64%             |        30%        |
|          8          |            80%             |        30%        |

### 2-4. Server Side Performance(CPU usage)

-   Since server was implemented as node.js, the CPU share was based on the Node.js process.

| the number of users | P2P/Mesh(Signaling Server) | SFU(Media Server) |
| :-----------------: | :------------------------: | :---------------: |
|          2          |            0.1%            |        2%         |
|          3          |            0.1%            |        13%        |
|          4          |            0.1%            |        24%        |
|          5          |            0.1%            |        32%        |
|          6          |            0.1%            |        41%        |
|          7          |            0.1%            |        48%        |
|          8          |            0.1%            |        50%        |

## 3. Results

### 3-1. SFU Server(Media Server)

-   Real-time performance in several videos has decreased dramatically since the number of clients reached six.
-   When there were more than seven clients, some images were stopped for a few seconds.
-   Server Side had a very high CPU share compared to Signaling Server.
-   Client Side had a CPU share of about half compared to Signaling Server, which clearly showed a reduced load on the Client side.

### 3-2. Signaling Server (P2P/Mesh)

-   As the client increased, delay and real-timeness decreased slightly in the images, but the images did not stop.
-   Server Side's CPU share remained at 0.1% regardless of the increase in the client.
-   Client Side's CPU share increased significantly as the client increased.

## [GitHub]

-   [1:N P2P WebRTC](https://github.com/millo-L/Typescript-ReactJS-WebRTC-1-N-P2P)
-   [1:N SFU WebRTC](https://github.com/millo-L/Typescript-ReactJS-WebRTC-1-N-SFU)

## [References]

-   [1:N P2P WebRTC](<https://millo-l.github.io/Implementing-WebRTC-using-ReactJS-and-Typescript(1-N-P2P)/>)
-   [1:N SFU WebRTC](<https://millo-l.github.io/Implementing-WebRTC-using-ReactJS-and-Typescript(1-N-SFU)/>)
-   [WebRTC implementation method(Mesh, SFU, MCU)](<https://millo-l.github.io/WebRTC-implementation-method(Mesh-SFU-MCU)/>)
