import React from "react";
import { useState } from "react";
import Input from "../input";

const Searchbar = ({ className, placeholder, style, value, setValue }) => {
  const filter = (text) => {
    setValue(text);
  };

  return (
    <Input
      className={className}
      value={value}
      onChange={filter}
      placeholder={placeholder}
      style={style}
    ></Input>
  );
};

export default Searchbar;
