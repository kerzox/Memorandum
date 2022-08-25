import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "../button";
import { Subtitle, Title } from "../text/TextComponent";

const KeyAlert = ({ visible, setVisible, content }) => {
  console.log(content);

  return visible ? (
    <div
      className="cancelBtn"
      style={{
        padding: 25,
        color: "white",
        transition: "opacity 0.6s",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ alignSelf: "center" }}>
          <strong>Important Infomation</strong>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <p>
              Copy this data somewhere safe! Your private key will not be
              recoverable
            </p>
            <Button
              onClick={() => setVisible(false)}
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
          <ul
            style={{
              display: "flex",
              flexDirection: "column",

              gap: 25,
              padding: 0,
            }}
          >
            <li style={{ listStyle: "none", overflowX: "scroll" }}>
              <strong>Public key</strong>
              <div
                className="shadow bg-dark"
                style={{ listStyle: "none", overflowX: "scroll", padding: 15 }}
              >
                {content.public_key}
              </div>
            </li>
            <li style={{ listStyle: "none", overflowX: "scroll" }}>
              <strong>Private key</strong>
              <div
                className="shadow bg-dark"
                style={{ listStyle: "none", overflowX: "scroll", padding: 15 }}
              >
                {content.private_key}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}></div>
    </div>
  ) : (
    <></>
  );
};

export default KeyAlert;
