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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ alignSelf: "center" }}>
          <strong>Important Infomation</strong>
          <p>
            Copy this data somewhere safe! Your private key will not be
            recoverable
          </p>
          <ul style={{ display: "flex", flexDirection: "column", width: 400 }}>
            <li style={{ listStyle: "none", overflowX: "scroll" }}>
              <strong>Public key</strong>
              <p className="shadow bg-dark" style={{ padding: 15 }}>
                {content.publicKey}
              </p>
            </li>
            <li style={{ listStyle: "none", overflowX: "scroll" }}>
              <strong>Private key</strong>
              <p
                className="shadow bg-dark"
                style={{ padding: 15, width: "auto" }}
              >
                {content.secretKey}
              </p>
            </li>
          </ul>
        </div>
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
      <div style={{ display: "flex", justifyContent: "center" }}></div>
    </div>
  ) : (
    <></>
  );
};

export default KeyAlert;
