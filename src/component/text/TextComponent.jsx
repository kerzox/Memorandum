import React from "react";
import "../text/styles.css";

const Title = (props) => {
  return (
    <h1 className="title" style={props.style}>
      {props.children}
    </h1>
  );
};

const Subtitle = (props) => {
  return (
    <p className="subtitle" style={props.style}>
      {props.children}
    </p>
  );
};

export { Title, Subtitle };
