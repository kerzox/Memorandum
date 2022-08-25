import { clear } from "@testing-library/user-event/dist/clear";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import Button from "../button";
import { Subtitle, Title } from "../text/TextComponent";

const Conversation = ({
  friend,
  profile,
  openConversation,
  socket,
  onlineUsers,
}) => {
  const [online, setOnline] = useState(false);
  const [time, updateTime] = useState("");
  const [intervalId, setIntervalId] = useState(0);

  useEffect(() => {
    if (friend !== undefined) {
      socket.emit("get_user", friend.id, ({ user }) => {
        if (user !== undefined) {
          setOnline(true);
        } else {
          setOnline(false);
          // const timerID = setInterval(() => {
          //   updateTime(getDifference(moment(friend.lastOnline)));
          //   setOnline(false);
          // });
          // setIntervalId(timerID);
        }
      });
    }
  }, [onlineUsers]);

  useEffect(() => {
    if (online) {
      if (intervalId !== undefined) {
        // console.log("turning timer off");
        // clearInterval(intervalId);
        // setIntervalId(undefined);
      }
    }
  }, [online]);

  // useEffect(() => {
  //   console.log(time);
  //   return () => clearInterval(intervalId);
  // }, [intervalId]);

  const getDifference = (time) => {
    return moment
      .utc(moment.duration(moment().diff(time)).as("milliseconds"))
      .format("HH:mm:ss");
  };

  return (
    <Button
      className="bg-dark"
      onClick={() => openConversation(friend.id, profile.user.id)}
      style={{
        textAlign: "left",
        flexDirection: "row",
        gap: 15,
        padding: 25,
      }}
    >
      <img
        style={{ width: 80, height: 80, borderRadius: 80 }}
        src={friend.profileImg === undefined ? "/pp.jpg" : friend.profileImg}
      ></img>
      <div style={{ width: "100%" }}>
        <Title style={{ color: "white", lineHeight: 0 }}>
          {friend.username}
        </Title>
        <div
          style={{
            display: "flex",
            gap: 5,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Subtitle style={{ color: "#5C5C5C", lineHeight: 0 }}>
            Your friend
          </Subtitle>
          <Subtitle
            style={{ color: online ? "#44e170" : "#5f5f5f", lineHeight: 0 }}
          >
            {online ? "Online" : `Offline`}
          </Subtitle>
        </div>
      </div>
    </Button>
  );
};

export default Conversation;
