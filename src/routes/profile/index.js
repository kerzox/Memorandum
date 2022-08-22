import React, { useState } from "react";
import { Title, Subtitle } from "../../component/text/TextComponent";
import Button from "../../component/button";
import { UilCommentAltPlus } from "@iconscout/react-unicons";
import Comment from "../../component/message";
import Input from "../../component/input";

const Profile = ({ token, profile, socket, notification, setNotification }) => {
  const { t, setToken } = token;

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [regusernameInput, setRegUsernameInput] = useState("");
  const [regpasswordInput, setRegPasswordInput] = useState("");

  const logout = () => {
    setToken(undefined);
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("http://neat.servebeer.com:25565/users/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });
      const data = await res.json();

      if (res.status === 200) {
        setToken({
          username: data.username,
          token: data.token,
        });
      } else {
        alert(data.message);
      }
    } catch (err) {}
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      let res = await fetch("http://neat.servebeer.com:25565/users/register", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: regusernameInput,
          password: regpasswordInput,
        }),
      });
      const data = await res.json();

      if (res.status === 201) {
        alert("Succesfully registered an account");
      } else {
        alert(data.message);
      }
    } catch (err) {}
  };

  return (
    <div className="contentWrapper">
      <div className="content">
        {profile != undefined ? (
          <>
            <div className="card">
              <Title>{profile.username}</Title>
              <Subtitle>Name</Subtitle>
              <Input style={{ width: "35%" }}></Input>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  className="cancelBtn"
                  style={{ width: "15%" }}
                  onClick={logout}
                >
                  Log out?
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <Title>Login to an account!</Title>
              <form
                onSubmit={login}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    paddingBottom: 15,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Input
                    placeholder={"Enter username"}
                    value={usernameInput}
                    onChange={setUsernameInput}
                  ></Input>
                  <Input
                    placeholder={"Enter password"}
                    value={passwordInput}
                    onChange={setPasswordInput}
                  ></Input>
                </div>

                <Button className="submitBtn">Login</Button>
              </form>
            </div>
            <div className="card">
              <Title>Or do you need to register?</Title>
              <form
                onSubmit={register}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    paddingBottom: 15,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Input
                    placeholder={"Enter username"}
                    value={regusernameInput}
                    onChange={setRegUsernameInput}
                  ></Input>
                  <Input
                    placeholder={"Enter password"}
                    value={regpasswordInput}
                    onChange={setRegPasswordInput}
                  ></Input>
                </div>

                <Button className="submitBtn">Register</Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
