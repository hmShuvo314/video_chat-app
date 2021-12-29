import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  makeStyles,
  Button,
  TextField,
} from "@material-ui/core";
import io from "socket.io-client";
import Peer from "peerjs";
import { Phone } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import SingleVideo from "./SingleVideo";
import { v4 as uuidV4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
  margin: {
    marginTop: 20,
  },
}));

const Videos = ({ socket }) => {
  const classes = useStyles();
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [peer, setPeer] = useState();
  const [myId, setMyId] = useState(null);
  const myVideoRef = useRef();
  const { roomId } = useParams();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((newStream) => {
        setStream(newStream);
        myVideoRef.current.srcObject = newStream;
      });

    const p = new Peer();
    setPeer(p);
    p.on("open", (id) => {
      setMyId(id);
    });
  }, []);

  useEffect(() => {
    if (!socket || !stream || !peer || !myId) return;
    socket.emit("join-room", { roomId, myId });

    socket.on("user-connected", (userId) => {
      const call = peer.call(userId, stream);

      call.on("stream", (remoteUserStream) => {
        setRemoteStreams((prev) => [...prev, remoteUserStream]);
      });
    });
  }, [socket, stream, peer, myId]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (remoteUserStream) => {
        setRemoteStreams((prev) => [...prev, remoteUserStream]);
      });
    });
  }, [peer, stream]);

  return (
    <>
      <Grid container className={classes.gridContainer}>
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom></Typography>
            <video
              playsInline
              muted
              ref={myVideoRef}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
        {remoteStreams.map((singleStream, i) => (
          <SingleVideo key={i} singleStream={singleStream} />
        ))}
      </Grid>
    </>
  );
};

export default Videos;
