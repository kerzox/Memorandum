import React from "react";

const Input = (props) => {
  const onChange = (e) => {
    props.onChange(e.target.value);
  };

  return (
    <input
      style={props.style}
      placeholder={props.placeholder}
      className={`input ${props.className}`}
      onChange={onChange}
      value={props.value}
    >
      {props.children}
    </input>
  );
};

export default Input;
