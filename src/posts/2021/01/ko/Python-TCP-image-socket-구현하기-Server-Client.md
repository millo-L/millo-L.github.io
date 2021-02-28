---
author: millo
title: Python TCP image socket 구현하기(Server, Client)
category: python
layout: post
released_at: 2021-01-27 17:00
updated_at:
image: ../../../../images/category/python.png
series: none
lang: ko
tags:
    - python
    - OpenCV
    - image socket
    - socket
    - TCP
is_private: false
translation:
translation_series: none
description: python에서 TCP socket을 사용한 이미지 송수신을 구현해보자.
---

# 1. 서론

작년에 진행한 [교차로 보행자 안전 알리미 프로젝트](https://www.youtube.com/watch?v=AuWtMnEUwC8&t=1s) Raspberry pi4와 인공지능 서버 사이의 TCP image socket을 구현했다. 실시간 영상 및 비디오 영상을 OpenCV를 사용하여 프레임 단위로 송수신하는 socket을 구현했다. 만약 Raspberry pi를 이용한다면 OpenCV 설치법이 좀 복잡해서 [이 포스팅](https://millo-L.github.io/Raspberry-pi%EC%97%90-OpenCV4-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0/)을 참고하길 바란다.

# 2. TCP image socket Server

TCP socket으로 이미지를 송수신할 때 가장 중요한 것은 클라이언트에서 서버로 해당 이미지 데이터의 크기를 같이 보내는 것이다. TCP socket을 사용해서 한 번에 보낼 수 있는 데이터의 크기는 제한되어 있으므로 이미지 데이터를 string으로 변환해서 보낼 때 이 크기가 얼마나 큰 지가 중요하다. 따라서, 이미지의 크기를 먼저 받고 그 크기만큼만 socket에서 데이터를 받아서 다시 이미지 데이터의 형태로 변환해야 한다.

```python
class ServerSocket:

    def __init__(self, ip, port):
        self.TCP_IP = ip
        self.TCP_PORT = port
        self.socketOpen()
        self.receiveThread = threading.Thread(target=self.receiveImages)
        self.receiveThread.start()

    def socketClose(self):
        self.sock.close()
        print(u'Server socket [ TCP_IP: ' + self.TCP_IP + ', TCP_PORT: ' + str(self.TCP_PORT) + ' ] is close')

    def socketOpen(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.bind((self.TCP_IP, self.TCP_PORT))
        self.sock.listen(1)
        print(u'Server socket [ TCP_IP: ' + self.TCP_IP + ', TCP_PORT: ' + str(self.TCP_PORT) + ' ] is open')
        self.conn, self.addr = self.sock.accept()
        print(u'Server socket [ TCP_IP: ' + self.TCP_IP + ', TCP_PORT: ' + str(self.TCP_PORT) + ' ] is connected with client')

    def receiveImages(self):

        try:
            while True:
                length = self.recvall(self.conn, 64)
                length1 = length.decode('utf-8')
                stringData = self.recvall(self.conn, int(length1))
                stime = self.recvall(self.conn, 64)
                print('send time: ' + stime.decode('utf-8'))
                now = time.localtime()
                print('receive time: ' + datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f'))
                data = numpy.frombuffer(base64.b64decode(stringData), numpy.uint8)
                decimg = cv2.imdecode(data, 1)
                cv2.imshow("image", decimg)
                cv2.waitKey(1)
        except Exception as e:
            print(e)
            self.socketClose()
            cv2.destroyAllWindows()
            self.socketOpen()
            self.receiveThread = threading.Thread(target=self.receiveImages)
            self.receiveThread.start()

    def recvall(self, sock, count):
        buf = b''
        while count:
            newbuf = sock.recv(count)
            if not newbuf: return None
            buf += newbuf
            count -= len(newbuf)
        return buf

def main():
    server = ServerSocket('localhost', 8080)

if __name__ == "__main__":
    main()
```

# 3. TCP image socket Client

## 3-1. cam 송신

Client에서는 Server에서 이미지 데이터를 받을 때 해당 이미지 데이터의 크기 정보를 같이 넘겨줘야 한다.

```python
class ClientSocket:
    def __init__(self, ip, port):
        self.TCP_SERVER_IP = ip
        self.TCP_SERVER_PORT = port
        self.connectCount = 0
        self.connectServer()

    def connectServer(self):
        try:
            self.sock = socket.socket()
            self.sock.connect((self.TCP_SERVER_IP, self.TCP_SERVER_PORT))
            print(u'Client socket is connected with Server socket [ TCP_SERVER_IP: ' + self.TCP_SERVER_IP + ', TCP_SERVER_PORT: ' + str(self.TCP_SERVER_PORT) + ' ]')
            self.connectCount = 0
            self.sendImages()
        except Exception as e:
            print(e)
            self.connectCount += 1
            if self.connectCount == 10:
                print(u'Connect fail %d times. exit program'%(self.connectCount))
                sys.exit()
            print(u'%d times try to connect with server'%(self.connectCount))
            self.connectServer()

    def sendImages(self):
        cnt = 0
        capture = cv2.VideoCapture(0)
        capture.set(cv2.CAP_PROP_FRAME_WIDTH, 480)
        capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 315)
        try:
            while capture.isOpened():
                ret, frame = capture.read()
                resize_frame = cv2.resize(frame, dsize=(480, 315), interpolation=cv2.INTER_AREA)

                now = time.localtime()
                stime = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f')

                encode_param=[int(cv2.IMWRITE_JPEG_QUALITY),90]
                result, imgencode = cv2.imencode('.jpg', resize_frame, encode_param)
                data = numpy.array(imgencode)
                stringData = base64.b64encode(data)
                length = str(len(stringData))
                self.sock.sendall(length.encode('utf-8').ljust(64))
                self.sock.send(stringData)
                self.sock.send(stime.encode('utf-8').ljust(64))
                print(u'send images %d'%(cnt))
                cnt+=1
                time.sleep(0.095)
        except Exception as e:
            print(e)
            self.sock.close()
            time.sleep(1)
            self.connectServer()
            self.sendImages()

def main():
    TCP_IP = 'localhost'
    TCP_PORT = 8080
    client = ClientSocket(TCP_IP, TCP_PORT)

if __name__ == "__main__":
    main()
```

## 3-2. local video 송신

Client에서는 Server에서 이미지 데이터를 받을 때 해당 이미지 데이터의 크기 정보를 같이 넘겨줘야 한다.

```python
class ClientVideoSocket:
    def __init__(self, ip, port, video_path):
        self.TCP_SERVER_IP = ip
        self.TCP_SERVER_PORT = port
        self.video_path = video_path
        self.connectCount = 0
        self.connectServer()

    def connectServer(self):
        try:
            self.sock = socket.socket()
            self.sock.connect((self.TCP_SERVER_IP, self.TCP_SERVER_PORT))
            print(u'Client socket is connected with Server socket [ TCP_SERVER_IP: ' + self.TCP_SERVER_IP + ', TCP_SERVER_PORT: ' + str(self.TCP_SERVER_PORT) + ' ]')
            self.connectCount = 0
            self.sendImages()
        except Exception as e:
            print(e)
            self.connectCount += 1
            if self.connectCount == 10:
                print(u'Connect fail %d times. exit program'%(self.connectCount))
                sys.exit()
            print(u'%d times try to connect with server'%(self.connectCount))
            time.sleep(1)
            self.connectServer()

    def sendImages(self):
        cnt = 0
        capture = cv2.VideoCapture(self.video_path)
        capture.set(cv2.CAP_PROP_FRAME_WIDTH, 480)
        capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 315)
        try:
            while capture.isOpened():
                ret, frame = capture.read()
                resize_frame = cv2.resize(frame, dsize=(480, 315), interpolation=cv2.INTER_AREA)

                now = time.localtime()
                stime = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f')

                encode_param=[int(cv2.IMWRITE_JPEG_QUALITY),90]
                result, imgencode = cv2.imencode('.jpg', resize_frame, encode_param)
                data = numpy.array(imgencode)
                stringData = base64.b64encode(data)
                length = str(len(stringData))
                self.sock.sendall(length.encode('utf-8').ljust(64))
                self.sock.send(stringData)
                self.sock.send(stime.encode('utf-8').ljust(64))
                print(u'send images %d'%(cnt))
                cnt+=1
                time.sleep(0.02)
        except Exception as e:
            print(e)
            self.sock.close()
            time.sleep(1)
            self.connectServer()
            self.sendImages()

def main():
    TCP_IP = 'localhost'
    TCP_PORT = 8080
    video_path = './big_buck_bunny_720p_10mb.mp4'
    client = ClientVideoSocket(TCP_IP, TCP_PORT, video_path)

if __name__ == "__main__":
    main()
```

# [GitHub]

-   https://github.com/millo-L/Python-TCP-Image-Socket
