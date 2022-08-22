import React from "react";

import { UilComment } from "@iconscout/react-unicons";
import { NavLink } from "react-router-dom";

import { Subtitle } from "../text/TextComponent";
import theme from "../../Themes";

const NavbarComponent = (props) => {
  const { headers, footers } = props;

  return (
    <div
      className="shadow"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "white",
      }}
    >
      <ul
        style={{
          margin: 0,
          width: 150,
          padding: "25px 0 0 0",
        }}
      >
        {headers.map((header) => (
          <li
            style={{
              listStyle: "none",
              backgroundColor: "white",
            }}
          >
            <NavLink
              style={{ justifyContent: "center", alignSelf: "center" }}
              className={({ isActive }) => (isActive ? "active link" : "link")}
              to={header.link}
            >
              {header.icon}
            </NavLink>
          </li>
        ))}
      </ul>
      <ul
        style={{
          margin: 0,
          width: 150,
          padding: "25px 0 0 0",
        }}
      >
        {footers.map((footer) => (
          <li
            style={{
              listStyle: "none",
              backgroundColor: "white",
            }}
          >
            <NavLink
              style={{ justifyContent: "center", alignSelf: "center" }}
              className={({ isActive }) => (isActive ? "active link" : "link")}
              to={footer.link}
            >
              {footer.icon}
              <Subtitle style={{ color: "black" }}>{footer.user}</Subtitle>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavbarComponent;
