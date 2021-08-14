---
author: millo
title: Implementing WebRTC using ReactJS and Typescript (1:N P2P)
category: webrtc
layout: post
released_at: 2021-03-05 13:00
updated_at:
image: ../../../../images/category/webrtc.png
series: WebRTC theory to practice
lang: en
tags:
    - WebRTC
    - P2P
    - Mesh
    - SignalingServer
    - nodejs
    - reactjs
    - typescript
is_private: false
translation: /WebRTC-구현하기-1-N-P2P/
translation_series: /WebRTC-이론부터-실전까지
description: Based on the theory of WebRTC, let's implement 1:N P2P real-time video transmission.
---

# 1. Introduction

Last time, I posted about [1:1 P2P communication using WebRTC](<https://millo-l.github.io/Implementing-WebRTC-using-ReactJS-and-Typescript(1-1-P2P)/>). This posting is supposed to be written assuming that you know the concept described in the previous posting, so if you see this article first, I recommend you to read [the previous article](<https://millo-l.github.io/Implementing-WebRTC-using-ReactJS-and-Typescript(1-1-P2P)/>). These two are quite similar because even a 1:N connection would implement the same P2P connection (Signaling Server format) as the 1:1 connection previously. We will focus on explaining a series of dynamically connected and terminated processes.

# 2. Implementation method

## What do 1:1 and 1:N connections have in common?

Although the other party who has a video conference changes from one person to several people, they are all the same in that they are all peer-to-peer (P2P). A 1:N connection, like a 1:1 connection, consists of a Signaling server to connect communications with the other party, and from then on the server is not involved and only communicates between Peers.

## What is the difference between 1:1 and 1:N connection?

The 1:N connection must have as many RTCPeerConnection as participating in a video conference, unlike the 1:1 connection we made last time. Therefore, it is recommended to conduct the test with 4 or 5 people because the overload is very severe. Please refer to [the previous post](<https://millo-l.github.io/WebRTC-implementation-method(Mesh-SFU-MCU)>) for explanation of this overload.

# 3. Code

## Signaling Server(Node.js)

> **Note** <br /> You must use socket.io version=2.3.0.

### 1. Socket event

-   connection
    -   Same as last post
-   join_room
    -   Same as last post
-   offer
    -   data
        -   offerSendID: socket id of user sending offfer
        -   offerSendEmail: email of user sending offfer
        -   sdp: RTCSessionDescription of user sending offfer
        -   offerReceiveID: socket id of the user to receive an offfer
    -   role
        -   Send socket id, email, and sdp of the sender that sends the offer to the receiver who needs to receive the offer.
-   answer
    -   data
        -   answerSendID: socket id of user sending answer
        -   sdp: RTCSessionDescription of user sending answer
        -   answerReceiveID: socket id of the user to receive an answer
    -   role
        -   Send socket id, email, and sdp of the sender that sends the answer to the receiver who needs to receive the answer.
-   candidate
    -   data
        -   candidateSendID: socket id of user sending RTCIceCandidate
        -   candidate: RTCIceCandidate of sender
        -   candidateReceiveID: socket id of the user to receive an candidate
    -   role
        -   Send socket id, cadidate of the sender to the receiver who needs to receive the cadidate.
-   disconnection
    -   Same as last post

### Because there was only one opponent in the 1:1 connection, there was no need to send socket id together in events that exchanged offer, answer, and cadidate. However, because there are several people in the same room in the 1:N connection, it is an important part of which user the data will be delivered.

```js
let users = {};
let socketToRoom = {};
const maximum = process.env.MAXIMUM || 4;

io.on("connection", socket => {
    socket.on("join_room", data => {
        if (users[data.room]) {
            const length = users[data.room].length;
            if (length === maximum) {
                socket.to(socket.id).emit("room_full");
                return;
            }
            users[data.room].push({ id: socket.id, email: data.email });
        } else {
            users[data.room] = [{ id: socket.id, email: data.email }];
        }
        socketToRoom[socket.id] = data.room;

        socket.join(data.room);
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

        const usersInThisRoom = users[data.room].filter(
            user => user.id !== socket.id
        );

        console.log(usersInThisRoom);

        io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
    });

    socket.on("offer", data => {
        socket.to(data.offerReceiveID).emit("getOffer", {
            sdp: data.sdp,
            offerSendID: data.offerSendID,
            offerSendEmail: data.offerSendEmail,
        });
    });

    socket.on("answer", data => {
        socket.to(data.answerReceiveID).emit("getAnswer", {
            sdp: data.sdp,
            answerSendID: data.answerSendID,
        });
    });

    socket.on("candidate", data => {
        socket.to(data.candidateReceiveID).emit("getCandidate", {
            candidate: data.candidate,
            candidateSendID: data.candidateSendID,
        });
    });

    socket.on("disconnect", () => {
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(user => user.id !== socket.id);
            users[roomID] = room;
            if (room.length === 0) {
                delete users[roomID];
                return;
            }
        }
        socket.to(roomID).emit("user_exit", { id: socket.id });
        console.log(users);
    });
});
```

## Client(ReactJS, Typescript)

> **Note** <br /> You must use socket.io-client version=2.3.0, @types/socket.io-client version=1.4.34.

### 1. Variables to use in the client

-   socket: Same as last post
-   users: array of counterparties' data (socket id, email, MediaStream)
-   localVideoRef: Same as last post
-   pcs: Dictionary variable to store the opponent's RTCPeerConnection ({pcs[socket.id] = RTCPeerConnection} format)
-   pc_config: Same as last post

```ts
const [socket, setSocket] = useState<SocketIOClient.Socket>();
const [users, setUsers] = useState<Array<IWebRTCUser>>([]);

let localVideoRef = useRef<HTMLVideoElement>(null);

let pcs: { [socketId: string]: RTCPeerConnection };

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

### 2. Socket event

-   all_users
    -   Get a list of all users in the same room except yourself.
    -   Each user invokes the createPeerConnection function to generate each RTCPeerConnection.
    -   Call the createOffer function via RTCPeerConneciton created for that user and send an offer signal only to that user.
-   getOffer
    -   The createPeerConnection function is called to generatePeerConnection for communication with the user who sent the offer.
    -   Set the remoteDescription of the RTCPeerConnection generated for that user to the sdp received from that user.
    -   Call the createAnswer function and send an answer signal to the user.
-   getAnswer
    -   Set the remoteDescription of RTCPeerConnection, which was created for the user who sent answer, to sdp of the user who sent answer.
-   getCandidate
    -   Add the received RTCIceCandidate to the RTCPeerConnection created for the user who sent the cadidate.
-   user_exit
    -   Delete the user's RTCPeerConnection from the pcs Dictionary.
    -   In users array, delete the data for that user.

```ts
let newSocket = io.connect("http://localhost:8080");
let localStream: MediaStream;

newSocket.on("all_users", (allUsers: Array<{ id: string; email: string }>) => {
    let len = allUsers.length;

    for (let i = 0; i < len; i++) {
        createPeerConnection(
            allUsers[i].id,
            allUsers[i].email,
            newSocket,
            localStream
        );
        let pc: RTCPeerConnection = pcs[allUsers[i].id];
        if (pc) {
            pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            })
                .then(sdp => {
                    console.log("create offer success");
                    pc.setLocalDescription(new RTCSessionDescription(sdp));
                    newSocket.emit("offer", {
                        sdp: sdp,
                        offerSendID: newSocket.id,
                        offerSendEmail: "offerSendSample@sample.com",
                        offerReceiveID: allUsers[i].id,
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
});

newSocket.on(
    "getOffer",
    (data: {
        sdp: RTCSessionDescription;
        offerSendID: string;
        offerSendEmail: string;
    }) => {
        console.log("get offer");
        createPeerConnection(
            data.offerSendID,
            data.offerSendEmail,
            newSocket,
            localStream
        );
        let pc: RTCPeerConnection = pcs[data.offerSendID];
        if (pc) {
            pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(
                () => {
                    console.log("answer set remote description success");
                    pc.createAnswer({
                        offerToReceiveVideo: true,
                        offerToReceiveAudio: true,
                    })
                        .then(sdp => {
                            console.log("create answer success");
                            pc.setLocalDescription(
                                new RTCSessionDescription(sdp)
                            );
                            newSocket.emit("answer", {
                                sdp: sdp,
                                answerSendID: newSocket.id,
                                answerReceiveID: data.offerSendID,
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            );
        }
    }
);

newSocket.on(
    "getAnswer",
    (data: { sdp: RTCSessionDescription; answerSendID: string }) => {
        console.log("get answer");
        let pc: RTCPeerConnection = pcs[data.answerSendID];
        if (pc) {
            pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
        //console.log(sdp);
    }
);

newSocket.on(
    "getCandidate",
    (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
        console.log("get candidate");
        let pc: RTCPeerConnection = pcs[data.candidateSendID];
        if (pc) {
            pc.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
                console.log("candidate add success");
            });
        }
    }
);

newSocket.on("user_exit", (data: { id: string }) => {
    pcs[data.id].close();
    delete pcs[data.id];
    setUsers(oldUsers => oldUsers.filter(user => user.id !== data.id));
});

setSocket(newSocket);
```

### 3. MediaStream Settings

-   Call the navigator.mediaDevices.getUserMedia() function to obtain your own MediaStream and register it with localVideoRef.
-   Signaling Server will be notified that you have joined the room. (The answer will then be given to the all_users event.)

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
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        localStream = stream;

        newSocket.emit("join_room", {
            room: "1234",
            email: "sample@naver.com",
        });
    })
    .catch(error => {
        console.log(`getUserMedia error: ${error}`);
    });
```

### 4. Create an RTCPeerConnection for the other party

-   Create a PeerConnection for a specific user and register localStream with RTCPeerConnection.
-   Store in pcs variable in key-value form socket.id-RTCPeerConnection
-   onicecandidate
    -   After creating an offer or answer signal, your icecandidate information event occurs.
    -   Send your icecandidate information through the Signaling Server to the person who sent the offer or answer.
-   oniceconnectionstatechange
    connection status is changed
-   ontrack
    -   If the other person's RTCSessionDescription is specified as a remoteSessionDescription in his RTCPeerConnection, an event about the other person's track data will occur.
    -   Register other party's stream with the other party's user data in users array.

```ts
const createPeerConnection = (
    socketID: string,
    email: string,
    newSocket: SocketIOClient.Socket,
    localStream: MediaStream
): RTCPeerConnection => {
    let pc = new RTCPeerConnection(pc_config);

    // add pc to peerConnections object
    pcs = { ...pcs, [socketID]: pc };

    pc.onicecandidate = e => {
        if (e.candidate) {
            console.log("onicecandidate");
            newSocket.emit("candidate", {
                candidate: e.candidate,
                candidateSendID: newSocket.id,
                candidateReceiveID: socketID,
            });
        }
    };

    pc.oniceconnectionstatechange = e => {
        console.log(e);
    };

    pc.ontrack = e => {
        console.log("ontrack success");
        setUsers(oldUsers => oldUsers.filter(user => user.id !== socketID));
        setUsers(oldUsers => [
            ...oldUsers,
            {
                id: socketID,
                email: email,
                stream: e.streams[0],
            },
        ]);
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

### 5. Video rendering of yourself and your opponent

-   IWebRTCUser: Interface used to store users
-   Props: Props used for Video Tags
-   Video: Component to print video of the other party

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

# [GitHub]

-   https://github.com/millo-L/Typescript-ReactJS-WebRTC-1-N-P2P

# [References]

-   https://millo-l.github.io/Implementing-WebRTC-using-ReactJS-and-Typescript(1-1-P2P)/
-   https://millo-l.github.io/WebRTC-implementation-method(Mesh-SFU-MCU)/
