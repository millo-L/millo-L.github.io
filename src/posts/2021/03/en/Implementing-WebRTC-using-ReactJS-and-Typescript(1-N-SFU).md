---
author: millo
title: Implementing WebRTC using ReactJS and Typescript (1:N SFU)
category: webrtc
layout: post
released_at: 2021-03-05 14:42
updated_at:
image: ../../../../images/category/webrtc.png
series: WebRTC theory to practice
lang: en
tags:
    - WebRTC
    - SFU
    - Media Server
    - nodejs
    - reactjs
    - typescript
is_private: false
translation: /WebRTC-구현하기-1-N-SFU/
translation_series: /WebRTC-이론부터-실전까지
description: Based on the theory of WebRTC, let's implement 1:N SFU real-time video transmission.
---

# 1. Introduction

Last time, I posted for [1:N P2P communication using WebRTC](<https://millo-l.github.io/Implementing-WebRTC-using-ReactJS-and-Typescript(1-N-P2P)/>). I thought about posting about the SFU method or not, but I thought it would be better to do it. SFU is a type of Media Server, so please click [here](<https://millo-l.github.io/WebRTC-implementation-method(Mesh-SFU-MCU)/>) to check the past posting. Media servers are used during commercialization using [Kurento](https://www.kurento.org/) and [mediasoup](https://mediasoup.org/documentation/). However, based on his theory, I wanted to organize an SFU server among media servers. The theoretical explanation was covered in the existing post, so please check the link here above. Assuming that you know all the theoretical backgrounds, I will write a post about the implementation.

# 2. Code

## SFU Server(Node.js)

> **Note** <br /> You must use socket.io version=2.3.0.

### 1. Variable Description

-   receiverPCs
    -   role
        -   Save RTCPeerConnection to receive MediaStream of connected user
    -   format
        -   receiverPCs[socketID of the user connected user] = RTCPeerConnection
-   senderPCs
    -   role
        -   Save RTCPeerConnection to send one user MediaStream of another user except yourself
    -   format
        -   senderPCs[socketID of user sending MediaStream] = [{id: socketID of user receiving MediaStream, pc: RTCPeerConnection for sending MediaStream}, ...]
        -   senderPCs[socketID] = Array<{id: string, pc: RTCPeerConnection}>
-   users
    -   role
        -   Save MediaStream received via RTCPeerConnection connected from receiverPCs with user's socketID
    -   format
        -   users[roomID] = [{id: socketID of user sending MediaStream, stream: MedaiStream sent by user via RTCPeerConnection}]
        -   users[roomID] = Array<{id: string, stream: MediaStream}>
-   socketToRoom
    -   role
        -   Save which room the user belongs to
    -   format
        -   socketToRoom[socketID] = Room ID to which user belongs

```js
let receiverPCs = {}
let senderPCs = {}
let users = {}
let socketToRoom = {}
```

### 2. socket 이벤트

-   joinRoom
    -   data
        -   id: Socket ID of the user joining the room
        -   room: room id
    -   role
        -   Send a list of socket id of users who are already in the room and sending their MediaStream to the server to the user who is now in.

```js
socket.on("joinRoom", data => {
    try {
        let allUsers = getOtherUsersInRoom(data.id, data.roomID)
        io.to(data.id).emit("allUsers", { users: allUsers })
    } catch (error) {
        console.log(error)
    }
})
```

-   senderOffer
    -   data
        -   senderSocketID: socket id of user who sent the offer of RTCPeerConnection that sends his MediaStream data to server
        -   roomID: Room ID to which user wants to belong
        -   sdp: RTCSessionDescription of user sending offer
    -   role
        -   Server received the offer of RTCPeerConnection to receive user's MediaStream and sent answer

> **Caution** <br /> The reason why createAnswer keeps both of **offerToReceiveAudio** and **offerToReceiveVideo** true is that they must receive both audio and video streams from users.

```js
socket.on("senderOffer", async data => {
    try {
        socketToRoom[data.senderSocketID] = data.roomID
        let pc = createReceiverPeerConnection(
            data.senderSocketID,
            socket,
            data.roomID
        )
        await pc.setRemoteDescription(data.sdp)
        let sdp = await pc.createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
        })
        await pc.setLocalDescription(sdp)
        socket.join(data.roomID)
        io.to(data.senderSocketID).emit("getSenderAnswer", { sdp })
    } catch (error) {
        console.log(error)
    }
})
```

-   senderCandidate
    -   data
        -   senderSocketID: Socket id of user who sent the candidate of RTCPeerConnection that sends his MediaStream data to the server
        -   candidate: RTCIceCandidate of user
    -   role
        -   Add RTCIceCandidate to the RTCPeerConnection saved when the user sends an off

```js
socket.on("senderCandidate", async data => {
    try {
        let pc = receiverPCs[data.senderSocketID]
        await pc.addIceCandidate(new wrtc.RTCIceCandidate(data.candidate))
    } catch (error) {
        console.log(error)
    }
})
```

-   receiverOffer
    -   data
        -   receiverSocketID: Socket id of user who sent an offer of RTCPeerConnection to receive MediaStream of user who has senderSocketID as socket id
        -   senderSocketID: socket id of user with RTCPeerConnection to send their MediaStream to server
        -   roomID: Room ID to which both receiverSocketID and senderSocketID belong
        -   sdp: RTCSessionDescription of user sending offer
    -   role
        -   User who has reciverSocketID as socketid receives an offer of RTCPeerConnection to receive MediaStream of user who has senderSocketID as socketid, and sends an answer

> **Caution** <br /> The reason why createAnswer has false versions of both **offerToReceiveAudio** and **offerToReceiveVideo** is that they do not receive audio and video streams from users.(The RTCPeerConnection you created now is a connection to send a stream of existing users.)

```js
socket.on("receiverOffer", async data => {
    try {
        let pc = createSenderPeerConnection(
            data.receiverSocketID,
            data.senderSocketID,
            socket,
            data.roomID
        )
        await pc.setRemoteDescription(data.sdp)
        let sdp = await pc.createAnswer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false,
        })
        await pc.setLocalDescription(sdp)
        io.to(data.receiverSocketID).emit("getReceiverAnswer", {
            id: data.senderSocketID,
            sdp,
        })
    } catch (error) {
        console.log(error)
    }
})
```

-   receiverCandidate
    -   data
        -   Socket id of user who sent an offfer of RTCPeerConnection to receive MediaStream of user who has senderSocketID as socket id
        -   senderSocketID: socket id of user with RTCPeerConnection to send their MediaStream to server
        -   candidate: RTCIceCandidate of user who has reciverSocketID as socket id
    -   role
        -   Add RTCIceCandidate to RTCPeerConnection saved when user with reciverSocketID as socketid

```js
socket.on("receiverCandidate", async data => {
    try {
        const senderPC = senderPCs[data.senderSocketID].filter(
            sPC => sPC.id === data.receiverSocketID
        )
        await senderPC[0].pc.addIceCandidate(
            new wrtc.RTCIceCandidate(data.candidate)
        )
    } catch (error) {
        console.log(error)
    }
})
```

-   disconnect
    -   role
        -   Turn off all RTCPeerConnection and MedaiStream associated with disconnected users

```js
socket.on("disconnect", () => {
    try {
        let roomID = socketToRoom[socket.id]

        deleteUser(socket.id, roomID)
        closeRecevierPC(socket.id)
        closeSenderPCs(socket.id)

        socket.broadcast.to(roomID).emit("userExit", { id: socket.id })
    } catch (error) {
        console.log(error)
    }
})
```

### 3. Function description

-   isIncluded
    -   parameter
        -   array: Array
        -   id: string
    -   role
        -   Returns if any of the Dictionaries in the array have an id match

```js
const isIncluded = (array, id) => {
    let len = array.length
    for (let i = 0; i < len; i++) {
        if (array[i].id === id) return true
    }
    return false
}
```

-   createReceiverPeerConnection
    -   parameter
        -   socketID: string
        -   socket: socketio.Socket
        -   roomID: string
    -   role
        -   Save the newly created pc as the value of reciverPCs with user's socketID as key and create an event to receive user's MediaStream through that pc

```js
const createReceiverPeerConnection = (socketID, socket, roomID) => {
    let pc = new wrtc.RTCPeerConnection(pc_config)

    if (receiverPCs[socketID]) receiverPCs[socketID] = pc
    else receiverPCs = { ...receiverPCs, [socketID]: pc }

    pc.onicecandidate = e => {
        //console.log(`socketID: ${socketID}'s receiverPeerConnection icecandidate`);
        socket.to(socketID).emit("getSenderCandidate", {
            candidate: e.candidate,
        })
    }

    pc.oniceconnectionstatechange = e => {
        //console.log(e);
    }

    pc.ontrack = e => {
        if (users[roomID]) {
            if (!isIncluded(users[roomID], socketID)) {
                users[roomID].push({
                    id: socketID,
                    stream: e.streams[0],
                })
            } else return
        } else {
            users[roomID] = [
                {
                    id: socketID,
                    stream: e.streams[0],
                },
            ]
        }
        socket.broadcast.to(roomID).emit("userEnter", { id: socketID })
    }

    return pc
}
```

-   createSenderPeerConnection
    -   parameter
        -   receiverSocketID: string
        -   senderSocketID: string
        -   socket: socketio.Socket
        -   roomID: string
    -   role
        -   It creates an RTCPeerConnection to deliver the user's MediaStream with the senderSocketID to the user with the receiverSockerID, and adds the video track and audio track of the senderSocketID user to the corresponding RTCPeerConnection.

```js
const createSenderPeerConnection = (
    receiverSocketID,
    senderSocketID,
    socket,
    roomID
) => {
    let pc = new wrtc.RTCPeerConnection(pc_config)

    if (senderPCs[senderSocketID]) {
        senderPCs[senderSocketID].filter(user => user.id !== receiverSocketID)
        senderPCs[senderSocketID].push({ id: receiverSocketID, pc: pc })
    } else
        senderPCs = {
            ...senderPCs,
            [senderSocketID]: [{ id: receiverSocketID, pc: pc }],
        }

    pc.onicecandidate = e => {
        //console.log(`socketID: ${receiverSocketID}'s senderPeerConnection icecandidate`);
        socket.to(receiverSocketID).emit("getReceiverCandidate", {
            id: senderSocketID,
            candidate: e.candidate,
        })
    }

    pc.oniceconnectionstatechange = e => {
        //console.log(e);
    }

    const sendUser = users[roomID].filter(user => user.id === senderSocketID)
    sendUser[0].stream.getTracks().forEach(track => {
        pc.addTrack(track, sendUser[0].stream)
    })

    return pc
}
```

-   getOtherUsersInRoom
    -   parameter
        -   socketID: string
        -   roomID: string
    -   role
        -   Returns an array of socket id for all users in the room ID except for themselves

```js
const getOtherUsersInRoom = (socketID, roomID) => {
    let allUsers = []

    if (!users[roomID]) return allUsers

    let len = users[roomID].length
    for (let i = 0; i < len; i++) {
        if (users[roomID][i].id === socketID) continue
        allUsers.push({ id: users[roomID][i].id })
    }

    return allUsers
}
```

-   deleteUser
    -   parameter
        -   socketID: string
        -   roomID: string
    -   role
        -   Remove the user from the list containing the user's information.

```js
const deleteUser = (socketID, roomID) => {
    let roomUsers = users[roomID]
    if (!roomUsers) return
    roomUsers = roomUsers.filter(user => user.id !== socketID)
    users[roomID] = roomUsers
    if (roomUsers.length === 0) {
        delete users[roomID]
    }
    delete socketToRoom[socketID]
}
```

-   closeReceiverPC
    -   parameter
        -   socketID: string
    -   role
        -   Close the RTCPeerConnection that the socketID user connected to send his MediaStream, and delete it from the list.

```js
const closeRecevierPC = socketID => {
    if (!receiverPCs[socketID]) return

    receiverPCs[socketID].close()
    delete receiverPCs[socketID]
}
```

-   closeSenderPCs
    -   parameter
        -   socketID: string
    -   role
        -   Close all RTCPeerConnections that were connected to send MediaStream of socketID user to other users, and delete them from the list.

```js
const closeSenderPCs = socketID => {
    if (!senderPCs[socketID]) return

    let len = senderPCs[socketID].length
    for (let i = 0; i < len; i++) {
        senderPCs[socketID][i].pc.close()
        let _senderPCs = senderPCs[senderPCs[socketID][i].id]
        let senderPC = _senderPCs.filter(sPC => sPC.id === socketID)
        if (senderPC[0]) {
            senderPC[0].pc.close()
            senderPCs[senderPCs[socketID][i].id] = _senderPCs.filter(
                sPC => sPC.id !== socketID
            )
        }
    }

    delete senderPCs[socketID]
}
```

## Client(ReactJS, Typescript)

> **Note** <br /> You must use socket.io-client version=2.3.0, @types/socket.io-client version=1.4.34.

### 1. Variables to use in the client

-   socket: Sockets to communicate with the server (SocketIOClient.Socket)
-   users: Array of users' data (socket id, MediaStream)
-   localVideoRef: ref of the video tag on which you want to print your MediaStream
-   sendPC: RTCPeerConnection to send your MediaStream to the server
-   receivePCs: List of RTCPeerConnections to receive MediaStream from other users in the same room from the server (receivePCs[socket id] = RTCPeerConnection)
-   pc_config: RTCPeerConnection setting

```tsx
const [socket, setSocket] = useState<SocketIOClient.Socket>()
const [users, setUsers] = useState<Array<IWebRTCUser>>([])

let localVideoRef = useRef<HTMLVideoElement>(null)

let sendPC: RTCPeerConnection
let receivePCs: any

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

-   userEnter
    -   data
        -   id: The socket id of the user who joined the same room and connected the RTCPeerConnection to which his MediaStream will be sent to the server.
    -   role
        -   Generated RTCPeerConnection to receive MediaStream for that user and sent afer to the server

```tsx
newSocket.on("userEnter", (data: { id: string }) => {
    createReceivePC(data.id, newSocket)
})
```

-   allUsers
    -   data
        -   users: Array socket id of users who connect RTCPeerConnection to the server to send their MediaStream to the existing room
    -   role
        -   Generated RTCPeerConnection to receive MediaStream from those users and sent an offer to the server

```tsx
newSocket.on("allUsers", (data: { users: Array<{ id: string }> }) => {
    let len = data.users.length
    for (let i = 0; i < len; i++) {
        createReceivePC(data.users[i].id, newSocket)
    }
})
```

-   userExit
    -   data
        -   id: socket id of disconnected user
    -   role
        -   Close the RTCPeerConnection that you connected to receive MediaStream for that user, and delete it from the list

```tsx
newSocket.on("userExit", (data: { id: string }) => {
    receivePCs[data.id].close()
    delete receivePCs[data.id]
    setUsers(users => users.filter(user => user.id !== data.id))
})
```

-   getSenderAnswer
    -   data
        -   sdp: RTCSessionDescription received as an answer to the RTCPeerConnection that sent an offfer to send its MediaStream to the server
    -   role
        -   Specify sdp as the remoteDescription of the corresponding RTCPeerConnection

```tsx
newSocket.on(
    "getSenderAnswer",
    async (data: { sdp: RTCSessionDescription }) => {
        try {
            await sendPC.setRemoteDescription(
                new RTCSessionDescription(data.sdp)
            )
        } catch (error) {
            console.log(error)
        }
    }
)
```

-   getSenderCandidate
    -   data
        -   candidate: RTCIceCandidate sent by the server for RTCPeerConnection to send its MediaStream to the server
    -   role
        -   Add RTCIceCandidate to the corresponding RTCPeerConneciton.

```tsx
newSocket.on(
    "getSenderCandidate",
    async (data: { candidate: RTCIceCandidateInit }) => {
        try {
            if (!data.candidate) return
            sendPC.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (error) {
            console.log(error)
        }
    }
)
```

-   getReceiverAnswer
    -   data
        -   id: socket id of user, owner of MediaStream to be sent
        -   sdp: RTCSessionDescription sent to Answer for the offer of RTCPeerConnection in MediaStream to be sent
    -   role
        -   Specify sdp as the remoteDescription of the corresponding RTCPeerConnection

```tsx
newSocket.on(
    "getReceiverAnswer",
    async (data: { id: string; sdp: RTCSessionDescription }) => {
        try {
            let pc: RTCPeerConnection = receivePCs[data.id]
            await pc.setRemoteDescription(data.sdp)
        } catch (error) {
            console.log(error)
        }
    }
)
```

-   getReceiverCandidate
    -   data
        -   id: socket id of user, owner of MediaStream to be sent
        -   candidate: RTCIceCandidate sent from server for RTCPeerConnection of MediaStream to be sent
    -   role
        -   Add RTCIceCandidate to the corresponding RTCPeerConneciton.

```tsx
newSocket.on(
    "getReceiverCandidate",
    async (data: { id: string; candidate: RTCIceCandidateInit }) => {
        try {
            let pc: RTCPeerConnection = receivePCs[data.id]
            if (!data.candidate) return
            pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (error) {
            console.log(error)
        }
    }
)
```

### 3. MediaStream Settings

-   Call the navigator.mediaDevices.getUserMedia() function to obtain your own MediaStream and register it with localVideoRef.
-   Create an RTCPeerConnection to transfer your MediaStream and send an offer to the server.
-   The server informs the server that he has participated in the room. (Afterwards, the answer will be given to the allUsersocket event.)

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
        if (localVideoRef.current) localVideoRef.current.srcObject = stream

        localStream = stream

        sendPC = createSenderPeerConnection(newSocket, localStream)
        createSenderOffer(newSocket)

        newSocket.emit("joinRoom", {
            id: newSocket.id,
            roomID: "1234",
        })
    })
    .catch(error => {
        console.log(`getUserMedia error: ${error}`)
    })
```

### 4. Function Description

-   createReceivePC
    -   parameter
        -   id: string
        -   newSocket: SocketIOClient.Socket
    -   role
        -   Created RTCPeerConnection to receive MediaStream from other users in the room and sent an offer to the server

```tsx
const createReceivePC = (id: string, newSocket: SocketIOClient.Socket) => {
    try {
        let pc = createReceiverPeerConnection(id, newSocket)
        createReceiverOffer(pc, newSocket, id)
    } catch (error) {
        console.log(error)
    }
}
```

-   createSenderOffer
    -   parameter
        -   newSocket: SocketIOClient.Socket
    -   role
        -   Create an offer of RTCPeerConnection to send your MediaStream to the server
        -   Specifies RTCSessionDescription in the localDescription of the corresponding RTCPeerConnection.
        -   Send RTCSessionDescription via socket to server

> **Caution** <br /> Since RTCPeerConnection is for sending your MediaStream, leave both **offerToReceiveAudio** and **offerToReceiveVideo** as false.

```tsx
const createSenderOffer = async (newSocket: SocketIOClient.Socket) => {
    try {
        let sdp = await sendPC.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false,
        })
        await sendPC.setLocalDescription(new RTCSessionDescription(sdp))

        newSocket.emit("senderOffer", {
            sdp,
            senderSocketID: newSocket.id,
            roomID: "1234",
        })
    } catch (error) {
        console.log(error)
    }
}
```

-   createReceiverOffer
    -   parameter
        -   pc: RTCPeerConnection
        -   newSocket: SocketIOClient.Socket
        -   senderSocketID: string
    -   role
        -   Create an offer for RTCPeerConnection to receive MediaStream from senderSocketID user
        -   Specifies RTCSessionDescription in the localDescription of the corresponding RTCPeerConnection.
        -   Send RTCSessionDescription via socket to server

> **Caution** <br /> Since RTCPeerConnection is intended to receive MediaStream from other users, both **offerToReceiveAudio** and **offerToReceiveVideo** should be true.

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
        })
        await pc.setLocalDescription(new RTCSessionDescription(sdp))

        newSocket.emit("receiverOffer", {
            sdp,
            receiverSocketID: newSocket.id,
            senderSocketID,
            roomID: "1234",
        })
    } catch (error) {
        console.log(error)
    }
}
```

-   createSenderPeerConnection
    -   parameter
        -   newSocket: SocketIOClient.Socket
        -   localStream: MediaStream
    -   role
        -   Create an RTCPeerConnection to send your MediaStream to the server and register localStream
        -   onicecandidate
            -   Your RTCIceCandidate information event occurred after you created the offer or answer signal.
            -   Send your RTCIceCandidate information to the server via Socket
        -   oniceconnectionstatechange
            -   Log when ICE connection status is changed
        -   Return generated RTCPeerConnection

```tsx
const createSenderPeerConnection = (
    newSocket: SocketIOClient.Socket,
    localStream: MediaStream
): RTCPeerConnection => {
    let pc = new RTCPeerConnection(pc_config)

    pc.onicecandidate = e => {
        if (e.candidate) {
            newSocket.emit("senderCandidate", {
                candidate: e.candidate,
                senderSocketID: newSocket.id,
            })
        }
    }

    pc.oniceconnectionstatechange = e => {
        console.log(e)
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

-   createReceiverPeerConnection
    -   parameter
        -   socketID: string
        -   newSocket: SocketIOClient.Socket
    -   role
        -   Create RTCPeerConnection to receive MediaStream from socketID user
        -   Store RTCPeerConnection created in key-value format in receivePCs variable
        -   onicecandidate
            -   Your RTCIceCandidate information event occurred after you created the offer or answer signal.
            -   Send your RTCIceCandidate information to the server via Socket
        -   oniceconnectionstatechange
            -   Log when ICE connection status is changed
        -   ontrack
            -   Specifying other users' RTCSessionDescription as remoteSessionDescription in their RTCPeerConnection results in an event about the other user's track data.
            -   register stream in users variable
        -   Return generated RTCPeerConnection

```tsx
const createReceiverPeerConnection = (
    socketID: string,
    newSocket: SocketIOClient.Socket
): RTCPeerConnection => {
    let pc = new RTCPeerConnection(pc_config)

    // add pc to peerConnections object
    receivePCs = { ...receivePCs, [socketID]: pc }

    pc.onicecandidate = e => {
        if (e.candidate) {
            newSocket.emit("receiverCandidate", {
                candidate: e.candidate,
                receiverSocketID: newSocket.id,
                senderSocketID: socketID,
            })
        }
    }

    pc.oniceconnectionstatechange = e => {
        console.log(e)
    }

    pc.ontrack = e => {
        setUsers(oldUsers => oldUsers.filter(user => user.id !== socketID))
        setUsers(oldUsers => [
            ...oldUsers,
            {
                id: socketID,
                stream: e.streams[0],
            },
        ])
    }

    // return pc
    return pc
}
```

### 5. Video rendering of yourself and your opponent

-   IWebRTCUser: Interface used to store users
-   Props: Props used for Video Tags
-   Video: Component to print video of the other party

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

# [GitHub]

-   https://github.com/millo-L/Typescript-ReactJS-WebRTC-1-N-SFU

# [References]

-   https://millo-l.github.io/Implementing-WebRTC-using-ReactJS-and-Typescript(1-N-P2P)/
-   https://millo-l.github.io/WebRTC-implementation-method(Mesh-SFU-MCU)/
