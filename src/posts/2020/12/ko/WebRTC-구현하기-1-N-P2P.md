---
author: millo
title: WebRTC 구현하기(1:N P2P)
category: webrtc
layout: post
released_at: 2020-12-31 17:00
updated_at:
image: ../../../../images/category/webrtc.png
series: WebRTC 이론부터 실전까지
lang: ko
tags:
    - WebRTC
    - P2P
    - Mesh
    - Signaling Server
    - nodejs
    - reactjs
    - typescript
is_private: false
translation:
translation_series: /WebRTC-theory-to-practice
description: WebRTC의 이론을 기반으로 1:N P2P 실시간 영상 송수신을 구현해보자.
---

# 1. 서론

지난 시간에는 [WebRTC를 이용한 1:1 P2P 통신](https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-1-P2P/)에 대해서 포스팅했다. 이번 포스팅은 저번 포스팅에서 설명한 개념은 안다고 가정하고 작성할 예정이기 때문에 혹시나 이 글을 먼저 본다면 이전 글을 다 읽고 오기를 추천한다. 1:N 연결이라고 해도 이전에 구현했던 1:1연결과 같은 P2P 연결(Signaling 서버 형식)을 구현할 것이기 때문에 크게 다른 점은 없다. 동적으로 연결되고 종료되는 일련의 과정을 설명하는 데 집중하도록 하겠다.

# 2. 구현 방식

## 2-1. 1:1 연결과의 공통점

화상 회의를 진행하는 상대방이 한 명에서 여러 명으로 변하긴 하지만 **P2P(peer to peer)라는 점에서는 동일**하다. 1:1 연결과 동일하게 Signaling 서버를 구성해서 상대방과의 통신을 연결한 후 부터는 서버가 관여하지 않고 Peer 간 통신만 이루어질 것이다.

## 2-2. 1:1 연결과의 차이점

1:N 연결은 저번 시간에 했던 1:1 연결과는 다르게 **RTCPeerConnection을 화상 회의에 참여하는 수만큼** 가지고 있어야 한다. 따라서 과부하가 매우 심하므로 4, 5명 정도와 테스트를 진행하는 것을 권장한다. 이 과부하에 대한 설명도 [지난 포스트](<https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84-%EB%B0%A9%EC%8B%9D(Mesh-SFU-MCU)/>)를 참고하길 바란다.

# 3. 실제 코드

## 3-1. Signaling Server(Node.js)

### 주의할 점: socket.io version=2.3.0을 사용하셔야합니다.

### 1. socket 이벤트

-   connection
    -   지난 포스트와 동일
-   join_room
    -   지난 포스트와 동일
-   offer
    -   data
        -   offerSendID: offer를 보내는 user의 socket id
        -   offerSendEmail: offer를 보내는 user의 email
        -   sdp: offer를 보내는 user의 RTCSessionDescription
        -   offerReceiveID: offer를 받을 user의 socket id
    -   role
        -   offer를 받아야하는 receiver에게 offer를 보내는 sender의 socket id, email, sdp를 보낸다.
-   answer
    -   data
        -   answerSendID: answer를 보내는 user의 socket id
        -   sdp: answer를 보내는 user의 RTCSessionDescription
        -   answerReceiveID: answer를 받을 user의 socket id
    -   role
        -   answer를 받아야하는 receiver에게 answer를 보내는 sender의 socket id, email, sdp를 보낸다.
-   candidate
    -   data
        -   candidateSendID: candidate를 보내는 user의 socket id
        -   candidate: sender의 RTCIceCandidate
        -   candidateReceiveID: candidate를 받는 user의 socket id
    -   role
        -   candidate를 받아야하는 receiver에게 sender의 socket id, candidate를 보낸다.
-   disconnection
    -   지난 포스트와 동일

### 1:1 연결에서는 상대방이 한 명 밖에 없기 때문에 offer, answer, candidate를 주고 받는 이벤트에서 socket id를 함께 보낼 필요가 없었다. 하지만 1:N 연결에서는 같은 방에 여러 명이 존재하기 때문에 어떤 user에게 데이터를 전달할지는 중요한 부분이다.

```js
let users = {}
let socketToRoom = {}
const maximum = process.env.MAXIMUM || 4

io.on("connection", socket => {
    socket.on("join_room", data => {
        if (users[data.room]) {
            const length = users[data.room].length
            if (length === maximum) {
                socket.to(socket.id).emit("room_full")
                return
            }
            users[data.room].push({ id: socket.id, email: data.email })
        } else {
            users[data.room] = [{ id: socket.id, email: data.email }]
        }
        socketToRoom[socket.id] = data.room

        socket.join(data.room)
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`)

        const usersInThisRoom = users[data.room].filter(
            user => user.id !== socket.id
        )

        console.log(usersInThisRoom)

        io.sockets.to(socket.id).emit("all_users", usersInThisRoom)
    })

    socket.on("offer", data => {
        socket.to(data.offerReceiveID).emit("getOffer", {
            sdp: data.sdp,
            offerSendID: data.offerSendID,
            offerSendEmail: data.offerSendEmail,
        })
    })

    socket.on("answer", data => {
        socket.to(data.answerReceiveID).emit("getAnswer", {
            sdp: data.sdp,
            answerSendID: data.answerSendID,
        })
    })

    socket.on("candidate", data => {
        socket.to(data.candidateReceiveID).emit("getCandidate", {
            candidate: data.candidate,
            candidateSendID: data.candidateSendID,
        })
    })

    socket.on("disconnect", () => {
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`)
        const roomID = socketToRoom[socket.id]
        let room = users[roomID]
        if (room) {
            room = room.filter(user => user.id !== socket.id)
            users[roomID] = room
            if (room.length === 0) {
                delete users[roomID]
                return
            }
        }
        socket.to(roomID).emit("user_exit", { id: socket.id })
        console.log(users)
    })
})
```

## 3-2. Client(ReactJS, Typescript)

### 주의할 점: socket.io-client version=2.3.0, @types/socket.io-client version=1.4.34을 사용하셔야 합니다.

### 1. Client에서 사용할 변수들

-   socket: 지난 포스트와 동일
-   users: 상대방의 데이터(socket id, email, MediaStream) 배열
-   localVideoRef: 지난 포스트와 동일
-   pcs: 상대방의 RTCPeerConnection 저장할 Dictionary 변수 (pcs[socket.id] = RTCPeerConnection 형태로 저장)
-   pc_config: 지난 포스트와 동일

```ts
const [socket, setSocket] = useState<SocketIOClient.Socket>()
const [users, setUsers] = useState<Array<IWebRTCUser>>([])

let localVideoRef = useRef<HTMLVideoElement>(null)

let pcs: { [socketId: string]: RTCPeerConnection }

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
}
```

### 2. Socket 수신 이벤트

-   all_users
    -   자신을 제외한 같은 방의 모든 user 목록을 받아온다.
    -   user들마다 createPeerConnection 함수를 호출해서 각각의 RTCPeerConnection을 생성한다.
    -   해당 user를 위해 생성한 RTCPeerConneciton을 통해 createOffer 함수를 호출하고 해당 user에게만 offer signal을 보낸다.
-   getOffer
    -   offer를 보낸 user와의 통신을 위해 createPeerConnection 함수를 호출해서 RTCPeerConnection을 생성한다.
    -   해당 user를 위해 생성한 RTCPeerConnection의 remoteDescription를 해당 user에게서 전달 받은 sdp로 설정한다.
    -   createAnswer 함수를 호출하고 해당 user에게 answer signal을 보낸다.
-   getAnswer
    -   answer을 보낸 user를 위해 생성해놓은 RTCPeerConnection의 remoteDescription를 answer을 보낸 user의 sdp로 설정한다.
-   getCandidate
    -   candidate를 보낸 user를 위해 생성해놓은 RTCPeerConnection에 받은 RTCIceCandidate를 추가한다.
-   user_exit
    -   pcs Dictionary에서 해당 user의 RTCPeerConnection을 삭제한다.
    -   users에서 해당 user의 데이터를 삭제한다.

```ts
let newSocket = io.connect("http://localhost:8080")
let localStream: MediaStream

newSocket.on("all_users", (allUsers: Array<{ id: string; email: string }>) => {
    let len = allUsers.length

    for (let i = 0; i < len; i++) {
        createPeerConnection(
            allUsers[i].id,
            allUsers[i].email,
            newSocket,
            localStream
        )
        let pc: RTCPeerConnection = pcs[allUsers[i].id]
        if (pc) {
            pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            })
                .then(sdp => {
                    console.log("create offer success")
                    pc.setLocalDescription(new RTCSessionDescription(sdp))
                    newSocket.emit("offer", {
                        sdp: sdp,
                        offerSendID: newSocket.id,
                        offerSendEmail: "offerSendSample@sample.com",
                        offerReceiveID: allUsers[i].id,
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
})

newSocket.on(
    "getOffer",
    (data: {
        sdp: RTCSessionDescription
        offerSendID: string
        offerSendEmail: string
    }) => {
        console.log("get offer")
        createPeerConnection(
            data.offerSendID,
            data.offerSendEmail,
            newSocket,
            localStream
        )
        let pc: RTCPeerConnection = pcs[data.offerSendID]
        if (pc) {
            pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(
                () => {
                    console.log("answer set remote description success")
                    pc.createAnswer({
                        offerToReceiveVideo: true,
                        offerToReceiveAudio: true,
                    })
                        .then(sdp => {
                            console.log("create answer success")
                            pc.setLocalDescription(
                                new RTCSessionDescription(sdp)
                            )
                            newSocket.emit("answer", {
                                sdp: sdp,
                                answerSendID: newSocket.id,
                                answerReceiveID: data.offerSendID,
                            })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }
            )
        }
    }
)

newSocket.on(
    "getAnswer",
    (data: { sdp: RTCSessionDescription; answerSendID: string }) => {
        console.log("get answer")
        let pc: RTCPeerConnection = pcs[data.answerSendID]
        if (pc) {
            pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        }
        //console.log(sdp);
    }
)

newSocket.on(
    "getCandidate",
    (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
        console.log("get candidate")
        let pc: RTCPeerConnection = pcs[data.candidateSendID]
        if (pc) {
            pc.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
                console.log("candidate add success")
            })
        }
    }
)

newSocket.on("user_exit", (data: { id: string }) => {
    pcs[data.id].close()
    delete pcs[data.id]
    setUsers(oldUsers => oldUsers.filter(user => user.id !== data.id))
})

setSocket(newSocket)
```

### 3. MediaStream 설정

-   navigator.mediaDevices.getUserMedia() 함수를 호출해서 자신의 MediaStream을 얻고 localVideoRef에 등록한다.
-   방에 참가했다고 Signaling Server에 알린다. (이후에 all_users 이벤트로 답이 온다.)

```ts
navigator.mediaDevices
    .getUserMedia({
        audio: true,
        video: {
            width: 240,
            height: 240,
        },
    })
    .then(stream => {
        if (localVideoRef.current) localVideoRef.current.srcObject = stream

        localStream = stream

        newSocket.emit("join_room", { room: "1234", email: "sample@naver.com" })
    })
    .catch(error => {
        console.log(`getUserMedia error: ${error}`)
    })
```

### 4. 상대방을 위한 RTCPeerConnection 생성

-   특정 user를 위한 PeerConnection 생성하고 localStream을 RTCPeerConnection에 등록한다.
-   pcs 변수에 socket.id-RTCPeerConnection의 key-value 형태로 저장
-   onicecandidate
    -   offer 또는 answer signal을 생성한 후부터 본인의 icecadidate 정보 이벤트가 발생한다.
    -   offer 또는 answer를 보냈던 상대방에게 본인의 icecandidate 정보를 Signaling Server를 통해 보낸다.
-   oniceconnectionstatechange
    -   ICE connection 상태가 변경됐을 때의 log
-   ontrack
    -   상대방의 RTCSessionDescription을 본인의 RTCPeerConnection에서의 remoteSessionDescription으로 지정하면 상대방의 track 데이터에 대한 이벤트가 발생한다.
    -   상대방의 user 데이터에 stream을 등록한다.

```ts
const createPeerConnection = (
    socketID: string,
    email: string,
    newSocket: SocketIOClient.Socket,
    localStream: MediaStream
): RTCPeerConnection => {
    let pc = new RTCPeerConnection(pc_config)

    // add pc to peerConnections object
    pcs = { ...pcs, [socketID]: pc }

    pc.onicecandidate = e => {
        if (e.candidate) {
            console.log("onicecandidate")
            newSocket.emit("candidate", {
                candidate: e.candidate,
                candidateSendID: newSocket.id,
                candidateReceiveID: socketID,
            })
        }
    }

    pc.oniceconnectionstatechange = e => {
        console.log(e)
    }

    pc.ontrack = e => {
        console.log("ontrack success")
        setUsers(oldUsers => oldUsers.filter(user => user.id !== socketID))
        setUsers(oldUsers => [
            ...oldUsers,
            {
                id: socketID,
                email: email,
                stream: e.streams[0],
            },
        ])
    }

    if (localStream) {
        console.log("localstream add")
        localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream)
        })
    } else {
        console.log("no local stream")
    }

    // return pc
    return pc
}
```

### 5. 본인과 상대방의 video 렌더링

-   IWebRTCUser: users 저장에 사용했던 인터페이스
-   Props: Video 태그에 사용되는 props
-   Video: 상대방의 video를 출력할 컴포넌트

```tsx
interface IWebRTCUser {
    id: string
    email: string
    stream: MediaStream
}

interface Props {
    email: string
    stream: MediaStream
    muted?: boolean
}

const Video = ({ email, stream, muted }: Props) => {
    const ref = useRef<HTMLVideoElement>(null)
    const [isMuted, setIsMuted] = useState<boolean>(false)

    useEffect(() => {
        if (ref.current) ref.current.srcObject = stream
        if (muted) setIsMuted(muted)
    })

    return (
        <Container>
            <VideoContainer ref={ref} muted={isMuted} autoPlay></VideoContainer>
            <UserLabel>{email}</UserLabel>
        </Container>
    )
}

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
            return <Video key={index} email={user.email} stream={user.stream} />
        })}
    </div>
)
```

# 4. 느낀 점

1:1 구현 포스팅은 크리스마스에 했는 데, 1:N은 12월 31일 올해의 마지막 날에 하게 됐다. 흠... 코로나가 얼른 끝나버렸으면 좋겠다. 1:1 구현을 하고 나서 WebRTC P2P에 대한 이해를 하고 나니 구현에 큰 어려움은 없었다. 다만 setUsers useState를 이용하는 데 실수를 해서 몇 시간을 뭐가 잘못됐는 지 헤매다가 결국 발견하고 허탈함을 느꼈다. 하지만 구현이 완료되고 나니 그런 허탈함보다 훨씬 큰 만족감이 왔다. 역시 나는 개발자랑 잘 맞는 것 같다. Nginx, 무료 도메인과 letsencrypt를 사용한 https 통신을 구현하고 주변 지인들과 테스트를 해본 결과 로컬이 아니어도 무리 없이 잘 진행됐다. 다만 이미 알고있었다시피 5명 정도가 되니까 클라이언트에서 무리가 가는 게 느껴졌다. 원래 구현하고 포스팅하고자 했던 내용은 여기까지이다. 계획을 마무리하니 뿌듯함이 느껴진다. 다음은 어떤 포스팅을 해볼까 고민중이다. 일단은 클라이언트 과부하에 대한 SFU 서버도 구현해볼 예정이다. 만약 구현이 완료되면 포스팅을 더 해보도록 하겠다. 어쩌다보니 WebRTC 개발자가 된 것 같은 기분이... 하지만 이 포스트가 많은 사람들에게 도움이 된다면 안 할 이유가 없을 것 같다.

# [GitHub]

-   https://github.com/millo-L/Typescript-ReactJS-WebRTC-1-N-P2P

# [참고]

-   https://millo-l.github.io/WebRTC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-1-P2P/
