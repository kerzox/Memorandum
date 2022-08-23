import moment from "moment";
import React from "react";
import Button from "../button";
import { Subtitle, Title } from "../text/TextComponent";

const Conversation = ({ friend, profile, openConversation }) => {
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
        style={{ width: 80, height: 80, borderRadius: 64 }}
        src="https://randomuser.me/api/portraits/men/11.jpg"
      ></img>
      <div>
        <Title style={{ color: "white", lineHeight: 0 }}>
          {friend.username}
        </Title>
        <div style={{ display: "flex", gap: 5 }}>
          <Subtitle style={{ color: "#5C5C5C", lineHeight: 0 }}>
            Your friend
          </Subtitle>
          <Subtitle style={{ color: "#9f9f9f", lineHeight: 0 }}>
            last online: {moment().format("HH:mm")}
          </Subtitle>
        </div>
      </div>
    </Button>
  );
};

export default Conversation;
