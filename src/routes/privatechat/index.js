import React, { useEffect, useState } from "react";
import { Title, Subtitle } from "../../component/text/TextComponent";
import Button from "../../component/button";
import { UilCommentAltPlus } from "@iconscout/react-unicons";
import Comment from "../../component/message";
import Input from "../../component/input";
import Themes from "../../Themes";
import Searchbar from "../../component/searchbar";

const PrivateChat = ({
  token,
  profile,
  socket,
  notification,
  setNotification,
}) => {
  const [online, setOnline] = useState([]);
  const [regexValue, changeRegexValue] = useState("");
  const [chosenUserId, setChosenUserId] = useState(undefined);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (socket != null) socket.emit("getUsers", "hello");
  }, []);

  useEffect(() => {
    if (notification.type === "online-users") {
      setOnline(notification.online);
    }
  }, [notification]);

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log(chosenUserId);
        let res = await fetch(
          `http://neat.servebeer.com:25565/users/${chosenUserId}/profile`
        );
        const data = await res.json();

        console.log(data);

        if (res.status == 200) {
          setUser(data.profile);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [chosenUserId]);

  const regex = new RegExp(regexValue, "i");
  let content =
    online.length > 0 ? online.filter((user) => regex.test(user.username)) : [];

  return (
    <div className="contentWrapper" style={{ height: "100%" }}>
      <div className="content" style={{ height: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "row", height: "100%" }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
              }}
            >
              {chosenUserId != undefined ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                  }}
                >
                  <div
                    className="shadow"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "white",
                      padding: 25,
                      justifyContent: "center",
                    }}
                  >
                    <Title>{user.username}</Title>
                  </div>
                  <div
                    className="shadow"
                    style={{
                      backgroundColor: "#f1f1f1",
                      display: "flex",
                      flex: 1,
                      padding: 25,
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 12,
                        backgroundColor: "white",
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingBottom: 15,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      ></div>
                      <ul style={{ flex: 1, backgroundColor: "#f1f1f1" }}></ul>
                      <div style={{ display: "flex", gap: 15 }}>
                        <Input
                          style={{ width: "85%" }}
                          placeholder="Send message"
                        ></Input>
                        <Button className="submitBtn" style={{ width: "15%" }}>
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    width: "25%",
                    height: "100%",
                    padding: 25,
                    gap: 15,
                  }}
                >
                  <Searchbar
                    value={regexValue}
                    onChangeRegex={changeRegexValue}
                    placeholder="Search for users..."
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      backgroundColor: "#f1f1f1",
                    }}
                  ></Searchbar>
                  <hr style={{ width: "100%" }}></hr>
                  {online.length > 0 ? (
                    content.map((u) => (
                      <li
                        className="shadow"
                        style={{
                          listStyle: "none",
                          backgroundColor: "#f1f1f1",
                        }}
                      >
                        <Button
                          onClick={() => setChosenUserId(u.username)}
                          style={{
                            padding: "2px 15px",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Subtitle>{u.username}</Subtitle>
                        </Button>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
