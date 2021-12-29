import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Phone } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  gridContainer: {
    gap: 20,
    height: "30vh",
    display: "Grid",
    placeContent: "center",

    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  container: {
    width: "600px",
    margin: "35px 0",
    padding: 0,
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: "10px 20px",
    border: "2px solid black",
  },
  room: {
    width: "300px",
    height: "200px",
    display: "grid",
    // placeContent: "center",
    placeItems: "center",
  },
  roomContainer: {
    display: "flex",
    // width: "100vw",
    padding: 30,

    rowGap: 10,
    gap: 10,
    columnGap: 10,
  },
  wrapper: {
    padding: 30,
    minHeight: "100vh",
  },
}));

const Home = ({ socket }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomsList, setRoomsList] = useState([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("get-rooms_list");
    socket.once("receive-rooms_list", (rooms) => {
      setRoomsList(rooms);
    });
    socket.on("add-new_rooms", (newRoom) => {
      setRoomsList((prevList) => [newRoom, ...prevList]);
      console.log(newRoom);
    });
  }, [socket]);

  const handleRoomCreation = () => {
    const newRoomId = uuidV4();
    socket.emit("create-new_room", { roomName, newRoomId });
    console.log("clicked", { roomName, newRoomId });
    navigate(`/${newRoomId}`);
  };
  return (
    <div className={classes.wrapper}>
      <Grid container className={classes.gridContainer}>
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6} className={classes.padding}>
            <Typography gutterBottom variant="h6">
              Create a room!
            </Typography>
            <TextField
              label="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={<Phone fontSize="large" />}
              fullWidth
              onClick={handleRoomCreation}
              className={classes.margin}
            >
              Create
            </Button>
          </Grid>
        </Paper>
      </Grid>

      <Grid container className={classes.roomContainer}>
        {roomsList.map(([id, name]) => (
          <Paper className={classes.room}>
            <Grid item xs={12} md={6} className={classes.paddisng}>
              <Typography gutterBottom variant="h6">
                {name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate(`/${id}`)}
              >
                Join: {name}
              </Button>
            </Grid>
          </Paper>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
