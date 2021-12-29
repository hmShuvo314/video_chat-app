import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useRef } from "react";
import { useEffect } from "react";

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

const SingleVideo = ({ singleStream }) => {
  const classes = useStyles();
  const userVideoRef = useRef();
  useEffect(() => {
    userVideoRef.current.srcObject = singleStream;
  }, []);
  return (
    <Paper className={classes.paper}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" gutterBottom></Typography>
        <video
          playsInline
          autoPlay
          className={classes.video}
          ref={userVideoRef}
        />
      </Grid>
    </Paper>
  );
};

export default SingleVideo;
