import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import VideoPlayer from "./Components/VideoPlayer";
import { v4 as uuidV4 } from "uuid";
import Home from "./Components/Home";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("https://video-chat-app-shuvo.herokuapp.com");
    setSocket(s);
  }, []);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home socket={socket} />} />
        <Route path="/:roomId" element={<VideoPlayer socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
