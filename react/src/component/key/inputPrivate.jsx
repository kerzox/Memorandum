import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "../button";
import Input from "../input";
import { Subtitle, Title } from "../text/TextComponent";
import { generateKeyPairs } from "../../secure/secure";

const KeyAlertPrivate = ({ keys, setKeys, toggleAlert, profile, socket }) => {
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState("");
  console.log(visible);

  useEffect(() => {
    setVisible(keys.private_key === undefined);
  }, []);

  return visible ? (
    <div
      className="cancelBtn"
      style={{
        padding: 25,
        color: "white",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <div
          style={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <strong>Important!</strong>
          <p style={{ lineHeight: 1 }}>
            Input your private key to decrypt secure mode messages!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 15,
              }}
            >
              <Input
                value={text}
                onChange={setText}
                className="shadow bg-dark"
              ></Input>
              <Button
                onClick={() => {
                  setKeys((curr) => ({ ...curr, private_key: text }));
                  setVisible(false);
                  alert(text);
                }}
                className="shadow submitBtn"
              >
                Go
              </Button>
            </div>
            <strong>Regenerate Keys</strong>
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <Button
                onClick={() => {
                  const keys = generateKeyPairs();
                  const updateKeys = async (id, key) => {
                    try {
                      let res = await fetch(
                        `${process.env.REACT_APP_SERVER_URL}/users/${id}/keys`,
                        {
                          method: "PUT",
                          headers: {
                            accept: "application/json",
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            publicKey: key,
                          }),
                        }
                      );

                      const data = await res.json();

                      if (res.status === 200) {
                        console.log(keys);
                        setKeys(keys);
                        setVisible(false);
                      } else {
                        alert(data.message);
                      }
                    } catch (err) {}
                  };
                  updateKeys(profile.user.id, keys.public_key);
                }}
              >
                Regenerate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default KeyAlertPrivate;
