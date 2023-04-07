import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "../button";
import { Subtitle, Title } from "../text/TextComponent";

const PopUpAlert = ({ visible, children }) => {
  return visible ? (
    <div
      className="popupAlert"
      style={{
        padding: 25,
        color: "white",
        justifyContent: "space-between",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignSelf: "center",
      }}
    >
      {children}
    </div>
  ) : (
    <></>
  );
};

export default PopUpAlert;
