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
import KeyAlertPrivate from "../key/inputPrivate";
import KeyAlert from "../key/alert";

const NavbarComponent = ({
  chooseConversation,
  profile,
  toggleFriendModal,
  socket,
  onEvent,
  keyHandler,
  keyAlert,
  onlineUsers,
}) => {
  const [friends, populateFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [mode, switchMode] = useState({ mode: "default" });

  const createConversation = async (friendID, userId) => {
    try {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/conversation/create`,
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
        console.log(data);
        chooseConversation(data.conversation.conversation);
        openConversation(friendID, userId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openConversation = async (friendID, userId) => {
    try {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/conversation/get?friend_id=${friendID}&user_id=${userId}`
      );
      const data = await res.json();

      if (res.status === 200) {
        console.log(data.conversation);
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
        `${process.env.REACT_APP_SERVER_URL}/users/${id}/friendrequests`
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
        `${process.env.REACT_APP_SERVER_URL}/users/${id}/friends`
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
      console.log(onEvent);
      if (onEvent?.data.response) {
        getFriends(profile.user.id);
      } else {
        getFriendRequests(profile.user.id);
      }
    }
  }, [onEvent]);

  useEffect(() => {
    getFriendRequests(profile?.user.id);
  }, []);

  return (
    <>
      {mode?.mode === "default" ? (
        <div
          style={{
            backgroundColor: "#1F1F1F",
            width: "750px",
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 25,
            }}
          ></div>
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
                      socket={socket}
                      onlineUsers={onlineUsers}
                      friend={f}
                      profile={profile}
                      openConversation={openConversation}
                    ></Conversation>
                  ))}
                </li>
              </ul>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", padding: 25 }}
            >
              <KeyAlert
                content={keyHandler.keys}
                visible={
                  keyAlert.alert1 && keyHandler.keys.private_key !== undefined
                }
                setVisible={keyAlert.toggleAlert}
              />
              <KeyAlertPrivate
                socket={socket}
                profile={profile}
                keys={keyHandler.keys}
                setKeys={keyHandler.setKeys}
              />
              {friendRequests.map((r) => (
                <NewFriendAlert
                  show={true}
                  socket={socket}
                  request={r}
                  profile={profile}
                  update={() => {
                    getFriends(profile.user.id);
                    console.log(socket);
                    socket.emit("cause_event", {
                      header: "refresh_user",
                      type: "friend_request",
                      recipient_id: r.id,
                      data: {
                        recipient_id: r.id,
                        sender: profile.user.id,
                        response: true,
                      },
                    });
                  }}
                ></NewFriendAlert>
              ))}
              <div style={{ display: "flex", gap: 15, paddingTop: 15 }}>
                <Button
                  onClick={() => toggleFriendModal(true)}
                  className="bg-black"
                  style={{ color: "white" }}
                >
                  Add friends
                </Button>
                <Button
                  onClick={() => toggleFriendModal(true)}
                  className="bg-black"
                  style={{ color: "white" }}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
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
