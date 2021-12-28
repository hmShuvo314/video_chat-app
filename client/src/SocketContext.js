import React, { createContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("http://localhost:5000");

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideoRef = useRef();
  const userVideoRef = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((newStream) => {
        setStream(newStream);
        myVideoRef.current.srcObject = newStream;
      });

    socket.on("me", (id) => setMe(id));
    socket.on("calluser", ({ from, name, signal }) => {
      setCall({ isReceivingCall: true, from, name, signal });
      console.log("calluser");
    });
  }, []);

  const answerCall = () => {
    setIsCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (newStream) => {
      userVideoRef.current.srcObject = newStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    console.log(id);
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (newStream) => {
      userVideoRef.current.srcObject = newStream;
    });

    socket.on("callaccepted", (signal) => {
      setIsCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setIsCallEnded(true);
    connectionRef.current.destroy();

    window.location.reload();
  };
  return (
    <SocketContext.Provider
      value={{
        call,
        isCallAccepted,
        myVideoRef,
        userVideoRef,
        stream,
        name,
        setName,
        isCallEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
