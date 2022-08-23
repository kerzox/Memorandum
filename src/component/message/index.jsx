import React from "react";
import { Subtitle } from "../text/TextComponent";

const Message = ({ fromUser, text }) => {
  console.log(fromUser, text);
  return fromUser ? (
    <div
      className="bg-blue"
      style={{
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 25,
        paddingBottom: 25,
        borderRadius: 12,
        maxWidth: 750,
        alignSelf: "flex-end",
        wordWrap: "break-word",
      }}
    >
      {text}
    </div>
  ) : (
    <div
      className="bg-dark"
      style={{
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 25,
        paddingBottom: 25,
        borderRadius: 12,
        alignSelf: "flex-start",
        maxWidth: 750,
        wordWrap: "break-word",
        textAlign: "left",
      }}
    >
      <Subtitle style={{ color: "white" }}>{text}</Subtitle>
    </div>
  );
};

export default Message;
