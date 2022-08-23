import moment from "moment";
import React, { useEffect, useState } from "react";
import Button from "../component/button";
import Input from "../component/input";
import Message from "../component/message";
import { Subtitle } from "../component/text/TextComponent";
import "../routes/styles/styles.css";

const Homepage = ({ conversation, profile, socket, onEvent }) => {
  const [messages, populateMessages] = useState([]);
  const [text, setText] = useState("");

  const sendMessage = async (id) => {
    try {
      let res = await fetch(`http://neat.servebeer.com:25565/messages/${id}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          sender_id: profile.user.id,
          recipient_id: conversation.participants[1],
        }),
      });
      const data = await res.json();

      if (res.status === 201) {
        socket.emit("send_message", {
          text: text,
          sender_id: profile.user.id,
          recipient_id: conversation.participants[1],
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
      let res = await fetch(`http://neat.servebeer.com:25565/messages/${id}`);
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

  useEffect(() => {
    if (conversation !== undefined) {
      getMessages(conversation.conversation);
    }
  }, [conversation]);

  useEffect(() => {
    console.log(onEvent.type);
    if (onEvent?.type === "private_message") {
      getMessages(conversation?.conversation);
    }
  }, [onEvent]);

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
              ></Message>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "row", padding: 25 }}>
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
                sendMessage(conversation?.conversation);
              }}
              className="bg-black"
              style={{ width: "15%", color: "white" }}
            >
              Send
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
