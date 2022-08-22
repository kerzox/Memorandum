import React from "react";
import { useState } from "react";
import Input from "../input";

const Searchbar = ({ placeholder, style, value, setValue }) => {
  const filter = (text) => {
    setValue(text);
  };

  return (
    <div style={{ display: "flex" }}>
      <Input
        value={value}
        onChange={filter}
        placeholder={placeholder}
        style={style}
      ></Input>
    </div>
  );
};

export default Searchbar;
