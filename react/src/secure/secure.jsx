import nacl, { box, randomBytes } from "tweetnacl";
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from "tweetnacl-util";
import { Buffer } from "buffer/";

const generateKeyPairs = () => {
  const pair = nacl.box.keyPair();
  return {
    public_key: Buffer.from(pair.publicKey, "utf8").toString("base64"),
    private_key: Buffer.from(pair.secretKey, "utf8").toString("base64"),
  };
};

const fromBase64 = (key) => {
  return Buffer.from(key, "base64");
};

const encodeMessage = (recipientPK, senderSK, msg) => {
  if (senderSK === undefined)
    alert("You must have a private key before sending encrypted messages");
  const shared = nacl.box.before(fromBase64(recipientPK), fromBase64(senderSK));
  const nonce = randomBytes(box.nonceLength);

  const encrypted = box.after(decodeUTF8(msg), nonce, shared);

  const message = new Uint8Array(nonce.length + encrypted.length);
  message.set(nonce);
  message.set(encrypted, nonce.length);

  return encodeBase64(message);
};

const decodeMessage = (recipientSK, senderPK, encryptedMsg) => {
  if (recipientSK === undefined) return encryptedMsg;
  console.log("Recipient SK: " + recipientSK);
  console.log("Senders PK: " + senderPK);
  console.log("Encrypted msg: " + encryptedMsg);
  const from64 = decodeBase64(encryptedMsg);
  const nonce = from64.slice(0, box.nonceLength);
  const cipher = from64.slice(box.nonceLength, encryptedMsg.length);

  const shared = nacl.box.before(fromBase64(senderPK), fromBase64(recipientSK));
  let decoded = nacl.box.open.after(cipher, nonce, shared);

  console.log(decoded);

  return encodeUTF8(decoded);
};

export { generateKeyPairs, fromBase64, encodeMessage, decodeMessage };
