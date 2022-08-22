import React, { useEffect, useState } from "react";
import { Title, Subtitle } from "../../component/text/TextComponent";
import Button from "../../component/button";
import "../styles/styles.css";
import { UilCommentAltPlus } from "@iconscout/react-unicons";
import Message from "../../component/message";
import MessageModal from "../../component/message/messageModal";
import moment from "moment";

const Dashboard = ({
  token,
  profile,
  socket,
  notification,
  setNotification,
}) => {
  const [newMessageVisible, toggleMessageModal] = useState(false);
  const [messages, setMessages] = useState([]);

  const sendMessage = async ({ title, content, created_on }) => {
    try {
      let res = await fetch("http://neat.servebeer.com:25565/messages/all", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          created_on,
          sender_id: profile.id,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        toggleMessageModal(false);
        socket.emit("message", { sender: profile.id, recipient: -1 });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed");
    }
  };

  const getMessages = async () => {
    try {
      let res = await fetch("http://neat.servebeer.com:25565/messages/all");

      const data = await res.json();

      if (res.status === 200) {
        setMessages(data);
      } else {
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (notification.type === "message") {
      if (notification.private) {
        alert(notification.msg);
        setNotification({});
      }
      getMessages();
    }
  }, [notification]);

  let formated = messages.sort((a, b) => {
    return moment(a.created_on).diff(moment(b.created_on)) < 0;
  });

  return (
    <div className="contentWrapper">
      <MessageModal
        visible={newMessageVisible}
        setVisible={toggleMessageModal}
        onSubmission={sendMessage}
      />
      <div className="headerDiv">
        <div>
          <Title style={{ lineHeight: 0, color: "#979797" }}>Global Chat</Title>
          <Subtitle style={{ color: "#a7a7a7" }}>
            Messages from everyone
          </Subtitle>
        </div>
        <div>
          <Button
            style={{
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              alignItems: "center",
              padding: 25,
              borderRadius: 12,
            }}
            onClick={() => {
              profile == undefined
                ? alert("You have to be logged in for that")
                : toggleMessageModal(!newMessageVisible);
            }}
          >
            <UilCommentAltPlus size={36} color={"#979797"} />
            <p style={{ paddingLeft: 15, paddingRight: 15, color: "#979797" }}>
              Add a message
            </p>
          </Button>
        </div>
      </div>
      <div className="content">
        {formated.map((m) => (
          <Message
            title={m.title}
            content={m.content}
            created_on={m.created_on}
            sender_id={m.sender_id}
          ></Message>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
