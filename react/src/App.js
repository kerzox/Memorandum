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
import nacl from "tweetnacl";
import KeyAlert from "./component/key/alert";
import { Buffer } from "buffer/";
import {
  generateKeyPairs,
  fromBase64,
  encodeMessage,
  decodeMessage,
} from "./secure/secure";
import PopUpAlert from "./component/basicAlert";

function App() {
  const [socket, setSocket] = useState(null);
  const [profile, setUser] = useState();
  const [selectedConversationId, setConversationId] = useState();
  const [registerVisible, setRegisterVisible] = useState(false);
  const [friendModal, toggleFriendModal] = useState(false);
  const [friendModal2, toggleFriendModal2] = useState(false);
  const [alert1, toggleAlert] = useState(false);
  const [keys, setKeys] = useState();
  const [onlineUsers, populateOnlineUsers] = useState([]);

  const [inputPopup, setPopupData] = useState({
    visible: false,
    title: "",
    content: "",
    color: "",
  });

  const [onEvent, updateEvents] = useState({
    type: "",
  });

  const [form, fillFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_SERVER_URL}:27005`);
    setSocket(newSocket);

    newSocket.on("event", (event_data) => {
      updateEvents(event_data);
    });

    newSocket.emit("get_online_users", {});

    return () => newSocket.close();
  }, []);

  const login = async () => {
    try {
      let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/login`, {
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
        setKeys((current) => ({
          ...current,
          public_key: data.user.publicKey,
        }));
      } else {
        setPopupData({
          visible: true,
          title: "Login Failed",
          content: data.message,
          color: "#e14444",
        });
      }
    } catch (err) {}
  };

  const register = async () => {
    try {
      const pair = generateKeyPairs();

      console.log(pair);

      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/register`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
            publicKey: pair.public_key,
          }),
        }
      );
      const data = await res.json();

      console.log(data);

      if (res.status === 201) {
        setKeys({
          public_key: pair.public_key,
          private_key: pair.private_key,
        });
        setPopupData({
          visible: true,
          title: "Register Success",
          content: data.message,
          color: "#44e170",
        });
        toggleAlert(true);
      } else {
        setPopupData({
          visible: true,
          title: "Register Failed",
          content: data.message,
          color: "#e14444",
        });
      }
    } catch (err) {}
  };

  const refreshUser = async (id) => {
    try {
      let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/${id}`);
      const data = await res.json();

      if (res.status === 200) {
        console.log(data);
        setUser((current) => ({
          ...current,
          user: data,
        }));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (onEvent.type === "alert") {
      alert(onEvent.message);
      console.log(onEvent.message);
    } else if (onEvent.type === "update_users") {
      console.log(onEvent.data);
      populateOnlineUsers(onEvent.data);
    } else if (onEvent.type === "refresh_user") {
      console.log(profile.user);
      refreshUser(profile.user.id);
    }
  }, [onEvent]);

  useEffect(() => {
    if (profile !== undefined) {
      console.log(profile);
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

  useEffect(() => {
    if (keys !== undefined) {
      toggleAlert(true);
      setConversationId(undefined);
    }
  }, [keys]);

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
              onlineUsers={onlineUsers}
              keyAlert={{ alert1, toggleAlert }}
              keyHandler={{ keys, setKeys }}
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
                      keyHandler={{ keys, setKeys }}
                      onEvent={onEvent}
                      socket={socket}
                      conversation={selectedConversationId}
                      profile={profile}
                      onlineUsers={onlineUsers}
                    />
                  }
                />
              </Routes>
            </div>
          </>
        ) : registerVisible ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <PopUpAlert visible={inputPopup.visible} setVisible={setPopupData}>
              <div
                className="shadow"
                style={{
                  alignSelf: "center",
                  width: 550,
                  backgroundColor: inputPopup.color,
                }}
              >
                <div style={{ padding: 25 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>{inputPopup.title}</strong>
                    <Button
                      onClick={() =>
                        setPopupData((curr) => ({
                          ...curr,
                          visible: false,
                        }))
                      }
                      style={{
                        backgroundColor: "transparent",
                        width: 15,
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      &times;
                    </Button>
                  </div>
                  <p>{inputPopup.content}</p>
                </div>
              </div>
            </PopUpAlert>
            <div
              className="shadow"
              style={{
                alignSelf: "center",
                width: 550,
                backgroundColor: "#292929",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 15,
                  padding: 25,
                  height: "100%",
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
                  type="password"
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
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <PopUpAlert visible={inputPopup.visible} setVisible={setPopupData}>
              <div
                className="shadow"
                style={{
                  alignSelf: "center",
                  width: 550,
                  backgroundColor: inputPopup.color,
                }}
              >
                <div style={{ padding: 25 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>{inputPopup.title}</strong>
                    <Button
                      onClick={() =>
                        setPopupData((curr) => ({
                          ...curr,
                          visible: false,
                        }))
                      }
                      style={{
                        backgroundColor: "transparent",
                        width: 15,
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      &times;
                    </Button>
                  </div>
                  <p>{inputPopup.content}</p>
                </div>
              </div>
            </PopUpAlert>
            <div
              className="shadow"
              style={{
                alignSelf: "center",
                width: 550,
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
                  type="password"
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
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
