import React from "react";

const Button = (props) => {
  return (
    <button
      style={props.style}
      className={`btn ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
