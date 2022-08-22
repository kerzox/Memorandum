import moment from "moment";
import React from "react";
import { useState } from "react";
import Button from "../button";
import Input from "../input";
import { Subtitle, Title } from "../text/TextComponent";

const MessageModal = ({ visible, setVisible, onSubmission }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const reset = () => {
    setTitle("");
    setContent("");
    setVisible(false);
  };

  return visible ? (
    <div
      className="shadow"
      style={{
        position: "absolute",
        width: "50%",
        top: "25%",
        left: "25%",
        backgroundColor: "white",
        borderRadius: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 50,
          padding: 50,
        }}
      >
        <div style={{ paddingBottom: 25 }}>
          <Title style={{ lineHeight: 0 }}>New Message</Title>
          <Subtitle>Writing a message</Subtitle>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <Input
            value={content}
            onChange={setContent}
            placeholder="Content"
            style={{ flex: 1 }}
          ></Input>
          <div style={{ display: "flex", flexDirection: "row", gap: 25 }}>
            <Button
              className="submitBtn"
              onClick={() =>
                onSubmission({
                  title: title,
                  content: content,
                  created_on: moment(),
                })
              }
            >
              Send
            </Button>
            <Button className="" onClick={reset}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default MessageModal;
