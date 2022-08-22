import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavbarComponent from "./component/nav/navbar";
import Dashboard from "./routes/dashboard";

import { UilComment, UilEstate, UilUser } from "@iconscout/react-unicons";
import Profile from "./routes/profile";

import { io } from "socket.io-client";
import PrivateChat from "./routes/privatechat";

function App() {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState();
  const [profile, setUser] = useState();
  const [notification, setNotification] = useState({});

  const getUserAccount = async (username) => {
    try {
      let res = await fetch(
        `http://neat.servebeer.com:25565/users/${username}/profile`
      );
      const data = await res.json();

      if (res.status == 200) {
        setUser(data.profile);
        socket.emit("newUser", data.profile);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const newSocket = io(`http://neat.servebeer.com:25565`);
    setSocket(newSocket);

    newSocket.on("notification", (arg) => {
      setNotification(arg);
    });
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (token != undefined) getUserAccount(token.username);
    else {
      if (socket != undefined) socket.emit("logout", profile.id);
      setUser(undefined);
    }
  }, [token]);

  useEffect(() => {}, [profile]);

  return (
    <BrowserRouter>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100vh",
          backgroundColor: "#F3F3F3",
        }}
      >
        <NavbarComponent
          headers={[
            {
              icon: <UilEstate size={32} color={"#979797"}></UilEstate>,
              link: "/",
            },
            {
              icon: <UilComment size={32} color={"#979797"}></UilComment>,
              link: "/message",
            },
          ]}
          footers={[
            {
              icon: <UilUser size={32} color={"#979797"}></UilUser>,
              link: "/profile",
              user: profile ? profile.username : undefined,
            },
          ]}
        />
        <div style={{ padding: 25, width: "100%" }}>
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  setNotification={setNotification}
                  notification={notification}
                  socket={socket}
                  profile={profile}
                  token={{
                    token,
                    setToken,
                  }}
                />
              }
            />
            <Route
              path="/message"
              element={
                <PrivateChat
                  setNotification={setNotification}
                  notification={notification}
                  socket={socket}
                  profile={profile}
                  token={{
                    token,
                    setToken,
                  }}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  socket={socket}
                  profile={profile}
                  token={{
                    token,
                    setToken,
                  }}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
