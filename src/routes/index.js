import moment from "moment";
import React, { useEffect, useState } from "react";
import Button from "../component/button";
import Input from "../component/input";
import Message from "../component/message";
import { Subtitle } from "../component/text/TextComponent";
import "../routes/styles/styles.css";
import { UilLock } from "@iconscout/react-unicons";
import { encodeMessage, decodeMessage } from "../secure/secure";

const Homepage = ({
  conversation,
  profile,
  socket,
  onEvent,
  keyHandler,
  onlineUsers,
}) => {
  const [messages, populateMessages] = useState([]);
  const [text, setText] = useState("");
  const [lockColor, setLockColor] = useState("gray");
  const [secureMode, setSecure] = useState(false);

  const getRecipient = () => {
    if (conversation.participants[0].id !== profile.user.id)
      return conversation.participants[0];
    else return conversation.participants[1];
  };

  const sendEncryptedMessage = (id) => {
    socket.emit(
      "get_public_key",
      {
        sender_id: profile.user.id,
        recipient: getRecipient().id,
      },
      (response) => {
        socket.emit("send_message", {
          text: encodeMessage(
            response.data[0].publicKey,
            keyHandler.keys.private_key,
            text
          ),
          sender_id: profile.user.id,
          recipient_id: getRecipient().id,
          room: "conversation:" + conversation.conversation,
        });
        populateMessages([
          ...messages,
          {
            sender_id: profile.user.id,
            text: text,
            encrypted: true,
          },
        ]);
      }
    );
  };
  /*

  */

  const getMessageFromSocket = (data) => {
    if (data === undefined) return;
    if (data?.from !== profile.user.id) {
      try {
        socket.emit(
          "get_public_key",
          {
            sender_id: profile.user.id,
            recipient: getRecipient().id,
          },
          (response) => {
            let decoded = decodeMessage(
              keyHandler.keys.private_key,
              response.data[0].publicKey,
              data.text
            );
            populateMessages([
              ...messages,
              {
                sender_id: data.from,
                text: decoded,
                encrypted: true,
              },
            ]);
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const sendMessage = async (id) => {
    try {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/messages/${id}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            sender_id: profile.user.id,
            recipient_id: conversation.participants[1].id,
          }),
        }
      );
      const data = await res.json();

      if (res.status === 201) {
        socket.emit("send_message", {
          text: text,
          sender_id: profile.user.id,
          recipient_id: conversation.participants[1].id,
          room: "conversation:" + conversation.conversation,
        });
        getMessages(id);
      } else {
        alert(data.message);
      }
    } catch (err) {}
  };

  const getMessages = async (id) => {
    try {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/messages/${id}`
      );
      const data = await res.json();

      if (res.status === 200) {
        populateMessages(data.messages);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isSecureModeAllowed = (conversation) => {
    let both = 0;
    conversation.participants.forEach((p) => {
      onlineUsers.all_online_users.forEach((ou) => {
        if (ou.username === p.username) {
          both++;
        }
      });
    });
    if (both === 2) {
      setLockColor("orange");
    } else {
      setLockColor("gray");
    }
  };

  useEffect(() => {
    if (conversation !== undefined && conversation.conversation !== undefined) {
      secureMode
        ? getMessageFromSocket()
        : getMessages(conversation?.conversation);
    }
    if (conversation !== undefined && conversation.conversation !== undefined)
      isSecureModeAllowed(conversation);
  }, [conversation]);

  useEffect(() => {
    console.log(onEvent.type);
    if (onEvent?.type === "private_message") {
      secureMode
        ? getMessageFromSocket(onEvent.message)
        : getMessages(conversation?.conversation);
    }
  }, [onEvent]);

  useEffect(() => {
    if (conversation !== undefined && conversation.conversation !== undefined)
      isSecureModeAllowed(conversation);
  }, [onlineUsers]);

  useEffect(() => {
    if (secureMode) setLockColor("green");
    else if (
      conversation !== undefined &&
      conversation.conversation !== undefined
    )
      isSecureModeAllowed(conversation);
  }, [secureMode]);

  return (
    <div
      style={{
        backgroundColor: "#292929",
        display: "flex",
        height: "100%",
        flexDirection: "column",
      }}
    >
      {conversation !== undefined ? (
        <>
          <div
            style={{
              backgroundColor: "#292929",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              paddingTop: 50,
              paddingLeft: 25,
              paddingRight: 25,
              gap: 25,
              overflow: "scroll",
            }}
          >
            {messages.map((msg) => (
              <Message
                fromUser={profile.user.id == msg.sender_id}
                text={msg.text}
                encrypted={msg.encrypted !== undefined ? true : false}
              ></Message>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 25,
              gap: 15,
            }}
          >
            <div style={{ display: "flex", flex: 1 }}>
              <Input
                onChange={setText}
                placeholder="Message..."
                style={{
                  flex: 1,
                  backgroundColor: "#0A0A0A",
                }}
              ></Input>
            </div>
            <Button
              onClick={() => {
                secureMode
                  ? sendEncryptedMessage(conversation?.conversation)
                  : sendMessage(conversation?.conversation);
              }}
              className="bg-black"
              style={{ width: "15%", color: "white", alignItems: "center" }}
            >
              Send
            </Button>
            <Button
              onClick={() => {
                console.log(!secureMode);
                if (lockColor === "orange") {
                  setSecure(true);
                } else if (lockColor === "green") {
                  setSecure(false);
                } else if (lockColor === "gray") {
                  setSecure(false);
                }
              }}
              className="bg-black"
              style={{
                width: 75,
                color: "white",
                alignItems: "center",
                cursor: lockColor == "gray" ? "not-allowed" : "pointer",
              }}
            >
              <UilLock color={lockColor} />
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Homepage;
