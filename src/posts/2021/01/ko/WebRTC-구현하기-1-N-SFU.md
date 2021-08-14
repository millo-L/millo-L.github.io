---
author: millo
title: WebRTC 구현하기(1:N SFU)
category: webrtc
layout: post
released_at: 2021-01-15 17:00
updated_at:
image: ../../../../images/category/webrtc.png
series: WebRTC 이론부터 실전까지
lang: ko
tags:
    - WebRTC
    - SFU
    - Media Server
    - nodejs
    - reactjs
    - typescript
is_private: false
translation: /Implementing-WebRTC-using-ReactJS-and-Typescript-1-N-SFU/
translation_series: /WebRTC-theory-to-practice
description: WebRTC의 이론을 기반으로 1:N SFU 미디어 서버를 만들어 실시간 영상 송수신을 구현해보자.
---

# 1. 서론

지난 시간에는 [WebRTC를 이용한 1:N P2P 통신](https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-N-P2P/)에 대해서 포스팅했다. SFU 방식에 대해 포스팅을 할까말까 고민을 했는 데 그래도 하는 게 낫지 않을까 싶어 이렇게 글을 남긴다. SFU는 Media Server의 한 종류로 그에 대한 설명은 [여기](<https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84-%EB%B0%A9%EC%8B%9D(Mesh-SFU-MCU)/>)를 눌러 지난 포스팅을 확인해보기 바란다. 미디어 서버는 [Kurento](https://www.kurento.org/)와 [mediasoup](https://mediasoup.org/documentation/) 등을 이용하여 상용화 단계에서 사용한다. 하지만 글쓴이는 이론을 바탕으로 미디어 서버, 그 중 SFU 서버를 구성해보고자 했다. 이론적인 설명은 기존의 포스팅에서 다뤘으니 위의 여기 링크를 눌러 확인해보기 바란다. 이론적인 바탕은 모두 안다고 가정하고 구현에 대한 포스팅을 작성해보겠다.

# 2. 실제 코드

## 2-1. SFU Server(Node.js)

### 주의할 점: socket.io version=2.3.0을 사용하셔야 합니다.

### 1. 변수 설명

-   receiverPCs
    -   role
        -   접속한 user의 MediaStream을 받기 위한 RTCPeerConnection을 저장
    -   format
        -   receiverPCs[접속한 user의 socketID] = RTCPeerConnection 변수
-   senderPCs
    -   role
        -   한 user에게 자신을 제외한 다른 user의 MediaStream을 보내기 위한 RTCPeerConnection을 저장
    -   format
        -   senderPCs[보내지는 MediaStream의 user socketID] = [{id: 받는 user의 socketID, pc: MediaStream을 보내기 위한 RTCPeerConnection}, ...]
        -   senderPCs[socketID] = Array<{id: string, pc: RTCPeerConnection}>
-   users
    -   role
        -   receiverPCs에서 연결된 RTCPeerConnection을 통해 받은 MediaStream을 user의 socketID와 함께 저장
    -   format
        -   users[roomID] = [{id: MediaStream 보내는 user의 socketID, stream: user가 RTCPeerConnection을 통해 보내는 MedaiStream}]
        -   users[roomID] = Array<{id: string, stream: MediaStream}>
-   socketToRoom
    -   role
        -   user가 어떤 room에 속해 있는 지 저장
    -   format
        -   socketToRoom[socketID] = user가 속해 있는 roomID

```js
let receiverPCs = {};
let senderPCs = {};
let users = {};
let socketToRoom = {};
```

### 2. socket 이벤트

-   joinRoom
    -   data
        -   id: room에 들어온 user의 socket id
        -   room: room id
    -   role
        -   기존에 room에 들어와 자신의 MediaStream을 서버에게 전송하고 있는 user들의 socket id 목록을 지금 들어온 user에게 전송

```js
socket.on("joinRoom", data => {
    try {
        let allUsers = getOtherUsersInRoom(data.id, data.roomID);
        io.to(data.id).emit("allUsers", { users: allUsers });
    } catch (error) {
        console.log(error);
    }
});
```

-   senderOffer
    -   data
        -   senderSocketID: 자신의 MediaStream 데이터를 서버로 보내는 RTCPeerConnection의 offer를 보낸 user의 socket id
        -   roomID: user가 소속되고자 하는 roomID
        -   sdp: offer를 보내는 user의 RTCSessionDescription
    -   role
        -   user의 MediaStream을 받을 RTCPeerConnection의 offer를 서버가 받고 answer을 보냄

#### 주의할 점: createAnswer에서 offerToReceiveAudio, offerToReceiveVideo를 모두 true로 두는 것은 user로 부터 audio와 video stream을 모두 받아와야 하기 때문이다.

```js
socket.on("senderOffer", async data => {
    try {
        socketToRoom[data.senderSocketID] = data.roomID;
        let pc = createReceiverPeerConnection(
            data.senderSocketID,
            socket,
            data.roomID
        );
        await pc.setRemoteDescription(data.sdp);
        let sdp = await pc.createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(sdp);
        socket.join(data.roomID);
        io.to(data.senderSocketID).emit("getSenderAnswer", { sdp });
    } catch (error) {
        console.log(error);
    }
});
```

-   senderCandidate
    -   data
        -   senderSocketID: 자신의 MediaStream 데이터를 서버로 보내는 RTCPeerConnection의 candidate를 보낸 user의 socket id
        -   candidate: user의 RTCIceCandidate
    -   role
        -   해당 user가 offer를 보낼 때 저장해놓은 RTCPeerConnection에 RTCIceCandidate를 추가

```js
socket.on("senderCandidate", async data => {
    try {
        let pc = receiverPCs[data.senderSocketID];
        await pc.addIceCandidate(new wrtc.RTCIceCandidate(data.candidate));
    } catch (error) {
        console.log(error);
    }
});
```

-   receiverOffer
    -   data
        -   receiverSocketID: senderSocketID를 socket id로 가지는 user의 MediaStream을 받기 위한 RTCPeerConnection의 offer를 보낸 user의 socket id
        -   senderSocketID: 서버로 자신의 MediaStream을 보내기 위한 RTCPeerConnection이 연결되어 있는 user의 socket id
        -   roomID: receiverSocketID와 senderSocketID가 모두 소속된 room ID
        -   sdp: offer를 보내는 user의 RTCSessionDescription
    -   role
        -   receiverSocketID를 socket id로 가지는 user가 senderSocketID를 socket id로 가지는 user의 MediaStream을 받기 위한 RTCPeerConnection의 offer를 서버가 받고 answer을 보냄

#### 주의할 점: createAnswer에서 offerToReceiveAudio, offerToReceiveVideo를 모두 false로 두는 것은 user로 부터 audio와 video stream을 받지 않기 때문이다. (지금 생성한 RTCPeerConnection은 기존에 있던 user의 stream을 보내기 위한 연결이다.)

```js
socket.on("receiverOffer", async data => {
    try {
        let pc = createSenderPeerConnection(
            data.receiverSocketID,
            data.senderSocketID,
            socket,
            data.roomID
        );
        await pc.setRemoteDescription(data.sdp);
        let sdp = await pc.createAnswer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false,
        });
        await pc.setLocalDescription(sdp);
        io.to(data.receiverSocketID).emit("getReceiverAnswer", {
            id: data.senderSocketID,
            sdp,
        });
    } catch (error) {
        console.log(error);
    }
});
```

-   receiverCandidate
    -   data
        -   receiverSocketID: senderSocketID를 socket id로 가지는 user의 MediaStream을 받기 위한 RTCPeerConnection의 offer를 보낸 user의 socket id
        -   senderSocketID: 서버로 자신의 MediaStream을 보내기 위한 RTCPeerConnection이 연결되어 있는 user의 socket id
        -   candidate: receiverSocketID를 socket id로 가지는 user의 RTCIceCandidate
    -   role
        -   receiverSocketID를 socket id로 가지는 user가 offer를 보낼 때 저장해놓은 RTCPeerConnection에 RTCIceCandidate를 추가

```js
socket.on("receiverCandidate", async data => {
    try {
        const senderPC = senderPCs[data.senderSocketID].filter(
            sPC => sPC.id === data.receiverSocketID
        );
        await senderPC[0].pc.addIceCandidate(
            new wrtc.RTCIceCandidate(data.candidate)
        );
    } catch (error) {
        console.log(error);
    }
});
```

-   disconnect
    -   role
        -   disconnect된 user와 연결되어 있는 모든 RTCPeerConnection 및 MedaiStream을 해제

```js
socket.on("disconnect", () => {
    try {
        let roomID = socketToRoom[socket.id];

        deleteUser(socket.id, roomID);
        closeRecevierPC(socket.id);
        closeSenderPCs(socket.id);

        socket.broadcast.to(roomID).emit("userExit", { id: socket.id });
    } catch (error) {
        console.log(error);
    }
});
```

### 3. 함수 설명

-   isIncluded
    -   parameter
        -   array: 배열
        -   id: string
    -   role
        -   배열 내의 Dictionary 중 id가 일치하는 것이 존재하는 지 여부 반환

```js
const isIncluded = (array, id) => {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        if (array[i].id === id) return true;
    }
    return false;
};
```

-   createReceiverPeerConnection
    -   parameter
        -   socketID: string
        -   socket: socketio.Socket
        -   roomID: string
    -   role
        -   user의 socketID를 key로 한 receiverPCs의 value로 새로 생성한 pc를 저장하고 그 pc를 통해 user의 MediaStream을 전달받는 이벤트 생성

```js
const createReceiverPeerConnection = (socketID, socket, roomID) => {
    let pc = new wrtc.RTCPeerConnection(pc_config);

    if (receiverPCs[socketID]) receiverPCs[socketID] = pc;
    else receiverPCs = { ...receiverPCs, [socketID]: pc };

    pc.onicecandidate = e => {
        //console.log(`socketID: ${socketID}'s receiverPeerConnection icecandidate`);
        socket.to(socketID).emit("getSenderCandidate", {
            candidate: e.candidate,
        });
    };

    pc.oniceconnectionstatechange = e => {
        //console.log(e);
    };

    pc.ontrack = e => {
        if (users[roomID]) {
            if (!isIncluded(users[roomID], socketID)) {
                users[roomID].push({
                    id: socketID,
                    stream: e.streams[0],
                });
            } else return;
        } else {
            users[roomID] = [
                {
                    id: socketID,
                    stream: e.streams[0],
                },
            ];
        }
        socket.broadcast.to(roomID).emit("userEnter", { id: socketID });
    };

    return pc;
};
```

-   createSenderPeerConnection
    -   parameter
        -   receiverSocketID: string
        -   senderSocketID: string
        -   socket: socketio.Socket
        -   roomID: string
    -   role
        -   senderSocketID를 socket id로 가진 user의 MediaStream을 receiverSockerID를 socket id 로 가진 user에게 전달하기 위한 RTCPeerConnection을 생성하고 해당 RTCPeerConnection에 senderSocketID user의 videotrack, audiotrack을 추가한다.

```js
const createSenderPeerConnection = (
    receiverSocketID,
    senderSocketID,
    socket,
    roomID
) => {
    let pc = new wrtc.RTCPeerConnection(pc_config);

    if (senderPCs[senderSocketID]) {
        senderPCs[senderSocketID].filter(user => user.id !== receiverSocketID);
        senderPCs[senderSocketID].push({ id: receiverSocketID, pc: pc });
    } else
        senderPCs = {
            ...senderPCs,
            [senderSocketID]: [{ id: receiverSocketID, pc: pc }],
        };

    pc.onicecandidate = e => {
        //console.log(`socketID: ${receiverSocketID}'s senderPeerConnection icecandidate`);
        socket.to(receiverSocketID).emit("getReceiverCandidate", {
            id: senderSocketID,
            candidate: e.candidate,
        });
    };

    pc.oniceconnectionstatechange = e => {
        //console.log(e);
    };

    const sendUser = users[roomID].filter(user => user.id === senderSocketID);
    sendUser[0].stream.getTracks().forEach(track => {
        pc.addTrack(track, sendUser[0].stream);
    });

    return pc;
};
```

-   getOtherUsersInRoom
    -   parameter
        -   socketID: string
        -   roomID: string
    -   role
        -   자신을 제외하고 room ID에 포함된 모든 유저의 socket id 배열을 반환

```js
const getOtherUsersInRoom = (socketID, roomID) => {
    let allUsers = [];

    if (!users[roomID]) return allUsers;

    let len = users[roomID].length;
    for (let i = 0; i < len; i++) {
        if (users[roomID][i].id === socketID) continue;
        allUsers.push({ id: users[roomID][i].id });
    }

    return allUsers;
};
```

-   deleteUser
    -   parameter
        -   socketID: string
        -   roomID: string
    -   role
        -   user의 정보가 포함된 목록에서 user를 제거한다.

```js
const deleteUser = (socketID, roomID) => {
    let roomUsers = users[roomID];
    if (!roomUsers) return;
    roomUsers = roomUsers.filter(user => user.id !== socketID);
    users[roomID] = roomUsers;
    if (roomUsers.length === 0) {
        delete users[roomID];
    }
    delete socketToRoom[socketID];
};
```

-   closeReceiverPC
    -   parameter
        -   socketID: string
    -   role
        -   socketID user가 자신의 MediaStream을 보내기 위해 연결한 RTCPeerConnection을 닫고, 목록에서 삭제한다.

```js
const closeRecevierPC = socketID => {
    if (!receiverPCs[socketID]) return;

    receiverPCs[socketID].close();
    delete receiverPCs[socketID];
};
```

-   closeSenderPCs
    -   parameter
        -   socketID: string
    -   role
        -   socketID user의 MediaStream을 다른 user에게 전송하기 위해 연결 중이던 모든 RTCPeerConnection을 닫고, 목록에서 삭제한다.

```js
const closeSenderPCs = socketID => {
    if (!senderPCs[socketID]) return;

    let len = senderPCs[socketID].length;
    for (let i = 0; i < len; i++) {
        senderPCs[socketID][i].pc.close();
        let _senderPCs = senderPCs[senderPCs[socketID][i].id];
        let senderPC = _senderPCs.filter(sPC => sPC.id === socketID);
        if (senderPC[0]) {
            senderPC[0].pc.close();
            senderPCs[senderPCs[socketID][i].id] = _senderPCs.filter(
                sPC => sPC.id !== socketID
            );
        }
    }

    delete senderPCs[socketID];
};
```

## 2-2. Client(ReactJS, Typescript)

### 주의할 점: socket.io-client version=2.3.0, @types/socket.io-client version=1.4.34을 사용하셔야 합니다.

### 1. 변수 설명

-   socket: 서버와 통신할 소켓 (SocketIOClient.Socket)
-   users: 상대방의 데이터(socket id, MediaStream) 배열
-   localVideoRef: 자신의 MediaStream을 출력할 video 태그의 ref
-   sendPC: 자신의 MediaStream을 서버에게 전송할 RTCPeerConnection
-   receivePCs: 같은 room에 참가한 다른 user들의 MediaStream을 서버에서 전송받을 RTCPeerConnection 목록 (receivePCs[socket id] = pc 형식)
-   pc_config: RTCPeerConnection 생성 시의 setting

```tsx
const [socket, setSocket] = useState<SocketIOClient.Socket>();
const [users, setUsers] = useState<Array<IWebRTCUser>>([]);

let localVideoRef = useRef<HTMLVideoElement>(null);

let sendPC: RTCPeerConnection;
let receivePCs: any;

const pc_config = {
    iceServers: [
        // {
        //   urls: 'stun:[STUN_IP]:[PORT]',
        //   'credentials': '[YOR CREDENTIALS]',
        //   'username': '[USERNAME]'
        // },
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};
```

### 2. Socket 수신 이벤트

-   userEnter
    -   data
        -   id: 같은 room에 참가하고 자신의 MediaStream을 전송할 RTCPeerConnection을 서버와 연결한 user의 socket id
    -   role
        -   해당 user의 MediaStream을 받을 RTCPeerConnection을 생성하고 서버로 offer를 보냄

```tsx
newSocket.on("userEnter", (data: { id: string }) => {
    createReceivePC(data.id, newSocket);
});
```

-   allUsers
    -   data
        -   users: 기존에 방에 참가해서 자신의 MediaStream을 전송할 RTCPeerConnection을 서버와 연결한 user들의 socket id 배열
    -   role
        -   해당 user들의 MediaStream을 받을 RTCPeerConnection을 생성하고 서버로 offer를 보냄

```tsx
newSocket.on("allUsers", (data: { users: Array<{ id: string }> }) => {
    let len = data.users.length;
    for (let i = 0; i < len; i++) {
        createReceivePC(data.users[i].id, newSocket);
    }
});
```

-   userExit
    -   data
        -   id: disconnect된 user의 socket id
    -   role
        -   해당 user의 MediaStream을 받기 위해 연결한 RTCPeerConnection을 닫고, 목록에서 삭제

```tsx
newSocket.on("userExit", (data: { id: string }) => {
    receivePCs[data.id].close();
    delete receivePCs[data.id];
    setUsers(users => users.filter(user => user.id !== data.id));
});
```

-   getSenderAnswer
    -   data
        -   sdp: 자신의 MediaStream을 서버로 보내기 위해 offer를 보낸 RTCPeerConnection에 대한 answer로 온 RTCSessionDescription
    -   role
        -   해당 RTCPeerConnection의 remoteDescription으로 sdp를 지정

```tsx
newSocket.on(
    "getSenderAnswer",
    async (data: { sdp: RTCSessionDescription }) => {
        try {
            await sendPC.setRemoteDescription(
                new RTCSessionDescription(data.sdp)
            );
        } catch (error) {
            console.log(error);
        }
    }
);
```

-   getSenderCandidate
    -   data
        -   candidate: 자신의 MediaStream을 서버로 보내기 위한 RTCPeerConnection을 위해 서버에서 보낸 RTCIceCandidate
    -   role
        -   해당 RTCPeerConneciton에 RTCIceCandidate 추가

```tsx
newSocket.on(
    "getSenderCandidate",
    async (data: { candidate: RTCIceCandidateInit }) => {
        try {
            if (!data.candidate) return;
            sendPC.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
            console.log(error);
        }
    }
);
```

-   getReceiverAnswer
    -   data
        -   id: 전송받을 MediaStream의 주인인 user의 socket id
        -   sdp: 전송받을 MediaStream의 RTCPeerConenction의 offer에 대한 answer로 온 RTCSessionDescription
    -   role
        -   해당 RTCPeerConnection의 remoteDescription으로 sdp를 지정

```tsx
newSocket.on(
    "getReceiverAnswer",
    async (data: { id: string; sdp: RTCSessionDescription }) => {
        try {
            let pc: RTCPeerConnection = receivePCs[data.id];
            await pc.setRemoteDescription(data.sdp);
        } catch (error) {
            console.log(error);
        }
    }
);
```

-   getReceiverCandidate
    -   data
        -   id: 전송받을 MediaStream의 주인인 user의 socket id
        -   candidate: 전송받을 MediaStream의 RTCPeerConenction을 위해 서버에서 보낸 RTCIceCandidate
    -   role
        -   해당 RTCPeerConneciton에 RTCIceCandidate 추가

```tsx
newSocket.on(
    "getReceiverCandidate",
    async (data: { id: string; candidate: RTCIceCandidateInit }) => {
        try {
            let pc: RTCPeerConnection = receivePCs[data.id];
            if (!data.candidate) return;
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
            console.log(error);
        }
    }
);
```

### 3. MediaStream 설정

-   navigator.mediaDevices.getUserMedia() 함수를 호출해서 자신의 MediaStream을 얻고 localVideoRef에 등록한다.
-   자신의 MediaStream을 전송할 RTCPeerConnection을 생성하고 서버에게 offer를 보낸다.
-   자신이 room에 참가했다고 서버에 알린다. (이후에 allUsers socket 이벤트로 답이 온다.)

```tsx
navigator.mediaDevices
    .getUserMedia({
        audio: true,
        video: {
            width: 240,
            height: 240,
        },
    })
    .then(stream => {
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        localStream = stream;

        sendPC = createSenderPeerConnection(newSocket, localStream);
        createSenderOffer(newSocket);

        newSocket.emit("joinRoom", {
            id: newSocket.id,
            roomID: "1234",
        });
    })
    .catch(error => {
        console.log(`getUserMedia error: ${error}`);
    });
```

### 4. 함수 설명

-   createReceivePC
    -   parameter
        -   id: string
        -   newSocket: SocketIOClient.Socket
    -   role
        -   room에 참가한 다른 user들의 MediaStream을 받을 RTCPeerConnection을 생성하고 서버에 offer를 보냄

```tsx
const createReceivePC = (id: string, newSocket: SocketIOClient.Socket) => {
    try {
        let pc = createReceiverPeerConnection(id, newSocket);
        createReceiverOffer(pc, newSocket, id);
    } catch (error) {
        console.log(error);
    }
};
```

-   createSenderOffer
    -   parameter
        -   newSocket: SocketIOClient.Socket
    -   role
        -   자신의 MediaStream을 서버에게 보낼 RTCPeerConnection의 offer를 생성
        -   RTCSessionDescription을 해당 RTCPeerConnection의 localDescription에 지정
        -   RTCSessionDescription을 소켓을 통해 서버로 전송

#### 주의할 점: 자신의 MediaStream을 보내기 위한 RTCPeerConnection이므로 offerToReceiveAudio, offerToReceiveVideo는 모두 false로 둔다.

```tsx
const createSenderOffer = async (newSocket: SocketIOClient.Socket) => {
    try {
        let sdp = await sendPC.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false,
        });
        await sendPC.setLocalDescription(new RTCSessionDescription(sdp));

        newSocket.emit("senderOffer", {
            sdp,
            senderSocketID: newSocket.id,
            roomID: "1234",
        });
    } catch (error) {
        console.log(error);
    }
};
```

-   createReceiverOffer
    -   parameter
        -   pc: RTCPeerConnection
        -   newSocket: SocketIOClient.Socket
        -   senderSocketID: string
    -   role
        -   senderSocketID user의 MediaStream을 전송받을 RTCPeerConnection의 offer를 생성
        -   RTCSessionDescription을 해당 RTCPeerConnection의 localDescription에 지정
        -   RTCSessionDescription을 소켓을 통해 서버로 전송

#### 주의할 점: 다른 user의 MediaStream을 받기 위한 RTCPeerConnection이므로 offerToReceiveAudio, offerToReceiveVideo는 모두 true로 둬야한다.

```tsx
const createReceiverOffer = async (
    pc: RTCPeerConnection,
    newSocket: SocketIOClient.Socket,
    senderSocketID: string
) => {
    try {
        let sdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(new RTCSessionDescription(sdp));

        newSocket.emit("receiverOffer", {
            sdp,
            receiverSocketID: newSocket.id,
            senderSocketID,
            roomID: "1234",
        });
    } catch (error) {
        console.log(error);
    }
};
```

-   createSenderPeerConnection
    -   parameter
        -   newSocket: SocketIOClient.Socket
        -   localStream: MediaStream
    -   role
        -   자신의 MediaStream을 서버로 보내기 위한 RTCPeerConnection을 생성하고 localStream을 등록
        -   onicecandidate
            -   offer 또는 answer signal을 생성한 후부터 본인의 RTCIceCandidate 정보 이벤트가 발생
            -   본인의 RTCIceCandidate 정보를 Socket을 통해 서버로 전송
        -   oniceconnectionstatechange
            -   ICE connection 상태가 변경됐을 때의 log
        -   생성된 RTCPeerConnection 반환

```tsx
const createSenderPeerConnection = (
    newSocket: SocketIOClient.Socket,
    localStream: MediaStream
): RTCPeerConnection => {
    let pc = new RTCPeerConnection(pc_config);

    pc.onicecandidate = e => {
        if (e.candidate) {
            newSocket.emit("senderCandidate", {
                candidate: e.candidate,
                senderSocketID: newSocket.id,
            });
        }
    };

    pc.oniceconnectionstatechange = e => {
        console.log(e);
    };

    if (localStream) {
        console.log("localstream add");
        localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
        });
    } else {
        console.log("no local stream");
    }

    // return pc
    return pc;
};
```

-   createReceiverPeerConnection
    -   parameter
        -   socketID: string
        -   newSocket: SocketIOClient.Socket
    -   role
        -   socketID user의 MediaStream을 받기 위한 RTCPeerConnection 생성
        -   receivePCs 변수에 key-value 형식으로 생성한 RTCPeerConnection 저장
        -   onicecandidate
            -   offer 또는 answer signal을 생성한 후부터 본인의 RTCIceCandidate 정보 이벤트가 발생
            -   본인의 RTCIceCandidate 정보를 Socket을 통해 서버로 전송
        -   oniceconnectionstatechange
            -   ICE connection 상태가 변경됐을 때의 log
        -   ontrack
            -   상대방의 RTCSessionDescription을 본인의 RTCPeerConnection에서의 remoteSessionDescription으로 지정하면 상대방의 track 데이터에 대한 이벤트가 발생
            -   users 변수에 stream을 등록
        -   생성된 RTCPeerConnection 반환

```tsx
const createReceiverPeerConnection = (
    socketID: string,
    newSocket: SocketIOClient.Socket
): RTCPeerConnection => {
    let pc = new RTCPeerConnection(pc_config);

    // add pc to peerConnections object
    receivePCs = { ...receivePCs, [socketID]: pc };

    pc.onicecandidate = e => {
        if (e.candidate) {
            newSocket.emit("receiverCandidate", {
                candidate: e.candidate,
                receiverSocketID: newSocket.id,
                senderSocketID: socketID,
            });
        }
    };

    pc.oniceconnectionstatechange = e => {
        console.log(e);
    };

    pc.ontrack = e => {
        setUsers(oldUsers => oldUsers.filter(user => user.id !== socketID));
        setUsers(oldUsers => [
            ...oldUsers,
            {
                id: socketID,
                stream: e.streams[0],
            },
        ]);
    };

    // return pc
    return pc;
};
```

### 5. 본인과 상대방의 video 렌더링

-   IWebRTCUser: users 저장에 사용했던 인터페이스
-   Props: Video 태그에 사용되는 props
-   Video: 상대방의 video를 출력할 컴포넌트

```tsx
interface IWebRTCUser {
    id: string;
    email: string;
    stream: MediaStream;
}

interface Props {
    email: string;
    stream: MediaStream;
    muted?: boolean;
}

const Video = ({ email, stream, muted }: Props) => {
    const ref = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState<boolean>(false);

    useEffect(() => {
        if (ref.current) ref.current.srcObject = stream;
        if (muted) setIsMuted(muted);
    });

    return (
        <Container>
            <VideoContainer ref={ref} muted={isMuted} autoPlay></VideoContainer>
            <UserLabel>{email}</UserLabel>
        </Container>
    );
};

return (
    <div>
        <video
            style={{
                width: 240,
                height: 240,
                margin: 5,
                backgroundColor: "black",
            }}
            muted
            ref={localVideoRef}
            autoPlay
        ></video>
        {users.map((user, index) => {
            return (
                <Video key={index} email={user.email} stream={user.stream} />
            );
        })}
    </div>
);
```

# 3. 느낀 점

미디어 서버를 처음으로 개발해보니 생각보다 부하가 엄청나다는 걸 처음 알았다. 물론 테스트 자체를 Client와 Server가 나의 한 PC에서 실행되다 보니 부하가 기하급수적으로 증가하는 걸 알고는 있지만, 미디어 서버를 구현하려면 돈이 많아야 되구나.. 라는 걸 다시금 느꼈다. 처음부터 SFU 서버까지 구현해보리라 생각하고 시작한 포스팅은 아니었지만 구현하다보니 이것저것 호기심이 생겨서 더더 해보자 하다보니 이렇게 구현하게 됐다. 구현 중 큰 어려움은 없었지만 createOffer, createAnswer 시에 offerToReceiveAudio, offerToReceiveVideo 속성에 대한 잘못된 이해로 고생을 좀 했다. 다른 사람들은 이런 고생을 안 했으면 좋겠단 마음으로 주의할 점에 꼼꼼히 기록해놨다. MCU 서버를 구현해볼지 안 할지는 사실 잘 모르겠다. 해보고 싶긴 한데 시간이 날지가 의문이기 때문에... 혹여나 누군가 요청한다면 도전해볼 의향은 있다. 다만, 미디어 서버 자체를 상용화해서 사용하는 경우에는 위의 서론에서 말한대로 [Kurento](https://www.kurento.org/)나 [mediasoup](https://mediasoup.org/documentation/) 등을 이용하는 것으로 알고 있으므로 직접 개발하는 것이 목적이 아닌 상용화가 목적이라면 저 두 사이트를 방문해서 공식문서를 기반으로 개발하기를 권장한다.

# [GitHub]

-   https://github.com/millo-L/Typescript-ReactJS-WebRTC-1-N-SFU

# [참고]

-   https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-N-P2P/
-   https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84-%EB%B0%A9%EC%8B%9D(Mesh-SFU-MCU)/
