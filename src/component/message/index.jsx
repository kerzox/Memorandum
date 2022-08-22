import moment from "moment";
import React, { Component, useState } from "react";
import Button from "../button";

import { Title, Subtitle } from "../text/TextComponent";
import {
  UilArrowUpLeft,
  UilGrinTongueWinkAlt,
  UilEdit,
} from "@iconscout/react-unicons";
import { useEffect } from "react";

const Message = ({ title, content, created_on, sender_id }) => {
  let formated = moment(created_on);
  const [sender, setSender] = useState("");

  const getSender = async (id) => {
    try {
      let res = await fetch(`http://neat.servebeer.com:25565/users/${id}`);

      const data = await res.json();

      if (res.status === 200) {
        setSender(data[0]);
      } else {
        console.log(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    getSender(sender_id);
  }, []);

  return (
    <div className="comment">
      <div className="imageDiv"></div>
      <div className="content" style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 15 }}>
            <Subtitle style={{ color: "#979797" }}>
              From {sender.username}
            </Subtitle>
            <Subtitle style={{ color: "#979797" }}>
              Posted on {formated.format("LL")} at {formated.format("hh:mm A")}
            </Subtitle>
          </div>
        </div>
        <Subtitle>{content}</Subtitle>
        <div style={{ display: "flex", width: "100%" }}>
          <Button className="btn" style={{ alignItems: "center" }}>
            <UilArrowUpLeft size={28} color={"#979797"}></UilArrowUpLeft>
            <p style={{ paddingLeft: 15, paddingRight: 15, color: "#979797" }}>
              Reply
            </p>
          </Button>
          <Button className="btn" style={{ alignItems: "center" }}>
            <UilGrinTongueWinkAlt
              size={28}
              color={"#979797"}
            ></UilGrinTongueWinkAlt>
            <p style={{ paddingLeft: 15, paddingRight: 15, color: "#979797" }}>
              React
            </p>
          </Button>
          <Button className="btn" style={{ alignItems: "center" }}>
            <UilEdit size={28} color={"#979797"}></UilEdit>
            <p style={{ paddingLeft: 15, paddingRight: 15, color: "#979797" }}>
              Edit
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Message;
