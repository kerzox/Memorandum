import React from "react";

import { UilComment } from "@iconscout/react-unicons";
import { NavLink } from "react-router-dom";

import { Subtitle, Title } from "../text/TextComponent";
import theme from "../../Themes";
import Searchbar from "../searchbar";
import moment from "moment";
import Button from "../button";
import { useState, useEffect } from "react";
import Conversation from "../conversation";
import NewFriendAlert from "../friendModal/alert";

const NavbarComponent = ({
  chooseConversation,
  profile,
  toggleFriendModal,
  socket,
  onEvent,
}) => {
  const [friends, populateFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const createConversation = async (friendID, userId) => {
    try {
      let res = await fetch(
        `http://neat.servebeer.com:25565/conversation/create`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date_created: moment(),
            name: "Private Message",
            participants: [userId, friendID],
          }),
        }
      );
      const data = await res.json();

      if (res.status === 201) {
        chooseConversation(data.conversation);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openConversation = async (friendID, userId) => {
    try {
      let res = await fetch(
        `http://neat.servebeer.com:25565/conversation/get?friend_id=${friendID}&user_id=${userId}`
      );
      const data = await res.json();

      if (res.status === 200) {
        chooseConversation(data.conversation);
      } else if (res.status === 404) {
        createConversation(friendID, userId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getFriendRequests = async (id) => {
    try {
      let res = await fetch(
        `http://neat.servebeer.com:25565/users/${id}/friendrequests`
      );
      const data = await res.json();
      console.log(data);
      if (res.status === 200) {
        setFriendRequests(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getFriends = async (id) => {
    try {
      let res = await fetch(
        `http://neat.servebeer.com:25565/users/${id}/friends`
      );
      const data = await res.json();

      if (res.status === 200) {
        populateFriends(data.friendProfiles);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFriends(profile.user.id);
  }, [profile]);

  useEffect(() => {
    if (onEvent?.type === "friend_request") {
      console.log("hello");
      getFriendRequests(profile.user.id);
    }
  }, [onEvent]);

  useEffect(() => {
    getFriendRequests(profile?.user.id);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#1F1F1F",
        width: "550px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: 25,
        }}
      >
        <Searchbar
          placeholder={"Search messages"}
          style={{
            width: "100%",
            backgroundColor: "#0A0A0A",
          }}
        ></Searchbar>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <ul style={{ padding: 0, justifyContent: "none" }}>
            <li
              style={{
                listStyle: "none",
              }}
            >
              {friends.map((f) => (
                <Conversation
                  friend={f}
                  profile={profile}
                  openConversation={openConversation}
                ></Conversation>
              ))}
            </li>
          </ul>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: 25 }}>
          {friendRequests.map((r) => (
            <NewFriendAlert
              request={r}
              profile={profile}
              update={() => getFriends(profile.user.id)}
            ></NewFriendAlert>
          ))}
          <Button
            onClick={() => toggleFriendModal(true)}
            className="bg-black"
            style={{ color: "white" }}
          >
            Add friends
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavbarComponent;
{
  /* <NavLink
style={{ justifyContent: "center", alignSelf: "center" }}
className={({ isActive }) => (isActive ? "active link" : "link")}
to={"/"}
>
<Subtitle style={{ color: "black" }}></Subtitle>
</NavLink> */
}
