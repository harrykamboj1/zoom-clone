import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io as ClientIO } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();
const socket = ClientIO("http://localhost:5000");


const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        // To get access for user audio and video control
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);

                try {
                    if (myVideo.current) {
                        myVideo.current.srcObject = currentStream;
                    }
                } catch (e) {
                    console.log("Error in myVideo :: " + e)
                }
            })
        socket.on('me', (id) => setMe(id));

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            console.log("Call User :: " + from + " " + callerName + " " + signal)
            setCall({ isReceivedCall: true, from, name: callerName, signal })
        })
    }, [])

    const answerCall = () => {

        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream }); // Setting up a new connection and passing stream as for video and audio option.

        peer.on('signal', (data) => {  // When signal has been received
            socket.emit('answercall', { signal: data, to: call.from })
        })

        peer.on('stream', (currentStream) => {
            try {
                userVideo.current.srcObject = currentStream;
            } catch (e) {
                console.log("Error in AnswerCall userVideoStream :: " + e)
            }
        });

        peer.signal(call.signal)

        connectionRef.current = peer;
    }

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', (data) => {  // When signal has been received
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name })
        })

        peer.on('stream', (currentStream) => {
            try {
                userVideo.current.srcObject = currentStream;
            } catch (e) {
                console.log("Error in userVideoStream :: " + e)
            }
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal)
        })

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        try {
            window.location.reload();
        } catch (e) {
            console.log("ERROR ::  " + e)
        }
    }

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext };