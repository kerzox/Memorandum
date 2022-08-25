import React, { useState } from "react";
import { useEffect } from "react";
import Button from "../button";
import Input from "../input";
import Searchbar from "../searchbar";
import { Subtitle, Title } from "../text/TextComponent";

const FriendModal = ({ visible, setVisible, profile, socket }) => {
  const [user, populateUser] = useState();
  const [value, setValue] = useState("");

  const addFriend = async (username) => {
    try {
      let res = await fetch(
        `http://neat.servebeer.com:25565/users/friend/${username}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: profile.user.id,
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.status === 201) {
        alert("Friend request sent");
        socket.emit("friend_request", {
          sender: profile.user,
          recipient_id: data.friend[0].id,
          response: false,
        });
      } else if (res.status === 200) {
        socket.emit("friend_request", {
          sender: profile.user,
          recipient_id: data.friend[0].id,
          response: false,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = async (username) => {
    try {
      let res = await fetch(
        `http://neat.servebeer.com:25565/users/${username}/profile`
      );
      const data = await res.json();

      if (res.status === 200) {
        populateUser(data.profile);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const reset = () => {
    setVisible(false);
  };

  return visible ? (
    <div
      className="shadow"
      style={{
        backgroundColor: "#3f3f3f",
        width: 550,
        height: 325,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: "auto",

        padding: 25,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            padding: 25,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: 15,
          }}
        >
          <Title style={{ color: "white" }}>Find friends</Title>
          <div style={{ display: "flex", gap: 25 }}>
            <Input
              onChange={setValue}
              className="shadow bg-dark"
              style={{ width: "100%" }}
            ></Input>
            <Button
              className="shadow bg-dark"
              style={{ width: "50%", color: "white" }}
              onClick={() => getUser(value)}
            >
              Search
            </Button>
          </div>
          <div
            className="shadow bg-dark"
            style={{
              padding: user !== undefined ? 0 : 5,
            }}
          >
            {user && (
              <Button
                onClick={() => addFriend(value)}
                className="shadow bg-dark"
                style={{
                  color: "white",
                  flexDirection: "row",
                  gap: 15,
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: 32, height: 32, borderRadius: 80 }}
                  src={
                    user.profileImg === undefined ? "/pp.jpg" : user.profileImg
                  }
                ></img>
                {user.username}
              </Button>
            )}
          </div>
          <div>
            <Button
              className="shadow cancelBtn"
              onClick={() => setVisible(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default FriendModal;
