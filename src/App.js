import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarComponent from "./component/nav/navbar";
import { UilComment, UilEstate, UilUser } from "@iconscout/react-unicons";

import { io } from "socket.io-client";
import Homepage from "./routes";
import { Title } from "./component/text/TextComponent";
import Input from "./component/input";
import Button from "./component/button";
import FriendModal from "./component/friendModal";

function App() {
  const [socket, setSocket] = useState(null);
  const [profile, setUser] = useState();
  const [selectedConversationId, setConversationId] = useState();
  const [registerVisible, setRegisterVisible] = useState(false);
  const [friendModal, toggleFriendModal] = useState(false);
  const [friendModal2, toggleFriendModal2] = useState(false);

  const [onEvent, updateEvents] = useState({
    type: "",
  });

  const [form, fillFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const newSocket = io(`http://neat.servebeer.com:25565`);
    setSocket(newSocket);

    newSocket.on("event", (event_data) => {
      updateEvents(event_data);
    });

    return () => newSocket.close();
  }, []);

  const login = async () => {
    try {
      let res = await fetch("http://neat.servebeer.com:25565/users/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (res.status === 200) {
        setUser(data);
      } else {
        alert(data.message);
      }
    } catch (err) {}
  };

  const register = async () => {
    try {
      let res = await fetch("http://neat.servebeer.com:25565/users/register", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (res.status === 201) {
        alert("Succesfully registered an account");
      } else {
        alert(data.message);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (onEvent.type == "alert") {
      alert(onEvent.message);
      console.log(onEvent.message);
    }
  }, [onEvent]);

  useEffect(() => {
    if (profile !== undefined) {
      socket.emit("newUser", profile.user);
    }
  }, [profile]);

  useEffect(() => {
    if (selectedConversationId !== undefined) {
      socket.emit(
        "open_conversation",
        "conversation:" + selectedConversationId.conversation
      );
    }
  }, [selectedConversationId]);

  return (
    <BrowserRouter>
      <div
        className="bg-dark"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100vh",
        }}
      >
        {profile != undefined ? (
          <>
            <FriendModal
              socket={socket}
              profile={profile}
              visible={friendModal}
              setVisible={toggleFriendModal}
            ></FriendModal>
            <NavbarComponent
              onEvent={onEvent}
              socket={socket}
              chooseConversation={setConversationId}
              toggleFriendModal={toggleFriendModal}
              profile={profile}
            />
            <div style={{ width: "100%" }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Homepage
                      onEvent={onEvent}
                      socket={socket}
                      conversation={selectedConversationId}
                      profile={profile}
                    />
                  }
                />
              </Routes>
            </div>
          </>
        ) : registerVisible ? (
          <div
            className="shadow"
            style={{
              width: 550,
              height: 325,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              margin: "auto",
              backgroundColor: "#292929",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 15,
                padding: 25,
              }}
            >
              <Title style={{ color: "white" }}>Register</Title>

              <Input
                placeholder="username"
                className="bg-dark"
                onChange={(text) =>
                  fillFormData((current) => ({ ...current, username: text }))
                }
              ></Input>
              <Input
                placeholder="password"
                className="bg-dark"
                onChange={(text) =>
                  fillFormData((current) => ({ ...current, password: text }))
                }
              ></Input>
              <div style={{ display: "flex", gap: 25 }}>
                <Button
                  onClick={register}
                  className="submitBtn"
                  style={{ alignItems: "center", width: "25%" }}
                >
                  Send
                </Button>
                <Button
                  onClick={() => setRegisterVisible(false)}
                  className="bg-dark"
                  style={{
                    color: "white",
                  }}
                >
                  Want to login?
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="shadow"
            style={{
              width: 550,
              height: 325,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              margin: "auto",
              backgroundColor: "#292929",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 15,
                padding: 25,
              }}
            >
              <Title style={{ color: "white" }}>Login</Title>

              <Input
                placeholder="username"
                className="bg-dark"
                onChange={(text) =>
                  fillFormData((current) => ({ ...current, username: text }))
                }
              ></Input>
              <Input
                placeholder="password"
                className="bg-dark"
                onChange={(text) =>
                  fillFormData((current) => ({ ...current, password: text }))
                }
              ></Input>
              <div style={{ display: "flex", gap: 25 }}>
                <Button
                  onClick={login}
                  className="submitBtn"
                  style={{ alignItems: "center", width: "25%" }}
                >
                  Send
                </Button>
                <Button
                  onClick={() => setRegisterVisible(true)}
                  className="bg-dark"
                  style={{
                    color: "white",
                  }}
                >
                  Register an account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
