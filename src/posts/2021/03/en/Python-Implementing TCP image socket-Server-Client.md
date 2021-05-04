---
author: millo
title: "[Python] Implementing TCP image socket(Server, Client)"
category: python
layout: post
released_at: 2021-03-21 19:39
updated_at:
image: ../../../../images/category/python.png
series: none
lang: en
tags:
    - python
    - OpenCV
    - image socket
    - socket
    - TCP
is_private: false
translation: /Python-TCP-image-socket-구현하기-Server-Client/
translation_series: none
description: Let's implement image sending and receiving using TCP socket in python.
---

# 1. Introdution

I implemented a TCP image socket between Raspberry pi 4 and an artificial intelligence server in [an intersection pedestrian safety notification project](https://www.youtube.com/watch?v=AuWtMnEUwC8&t=1s) last year. We implement a socket that sends and receives real-time and video images on a per-frame basis using OpenCV. If you use Raspberry Pi, the OpenCV installation method is a bit complicated, so please refer to [here](https://millo-L.github.io/Raspberry-pi%EC%97%90-OpenCV4-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0/).

# 2. TCP image socket Server

When sending and receiving images with TCP socket, the most important thing is to send the same size of the image data from the client to the server. Since the size of the data that can be sent at once using TCP socket is limited, it is important to convert the image data to string and send it. Therefore, it is necessary to receive the size of the image first and receive data from the socket only that size and convert it back to the form of image data.

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

## 3-1. Sending images(Client)

When sending image data to the server, the Client must hand over the size information of the image data together.

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

## 3-2. Sending local video

When sending image data to the server, the Client must hand over the size information of the image data together.

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
