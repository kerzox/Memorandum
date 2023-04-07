var express = require("express");
var router = express.Router();
var moment = require("moment");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/get", async function (req, res, next) {
  const { friend_id, user_id } = req.query;

  try {
    const conversations = await req.db
      .from("conversations")
      .select("*")
      .where({ participant: user_id });
    const conversations2 = await req.db
      .from("conversations")
      .select("*")
      .where({ participant: friend_id });

    console.log(conversations);
    console.log(conversations2);

    let sender = await req.db
    .from("users")
    .select("*")
    .where({ id: user_id });

    
    let friend = await req.db
    .from("users")
    .select("*")
    .where({ id: friend_id });


    let convo_ids = conversations.map((convo) => {
      for (let i = 0; i < conversations2.length; i++) {
        if (convo.conversation_id === conversations2[i].conversation_id) {
          return {
            conversation: convo.conversation_id,
            participants: [sender[0], friend[0]],
          };
        }
      }
    });
    for (let i = 0; i < convo_ids.length; i++) {
        if (convo_ids[i] !== undefined) {
            let wrapper = await req.db
            .from("conversation")
            .where({ id: convo_ids[i].conversation });
          if (wrapper[0].name === "Private Message") {
            res.status(200).json({
              conversation: convo_ids[i],
              message: "Private Message",
            });
            return;
          }
        }
      }

    // we didn't find a private conversation between friend and us so we create one

    res.status(404).json({
      message: "no valid conversation",
    });
    return;

  } catch (err) {
    console.log(err);
  }
});

router.post("/create", async function (req, res, next) {
  const { date_created, name, participants } = req.body;
  if (
    date_created == undefined ||
    name == undefined ||
    participants == undefined
  )
    res.status(401).json("Missing body");
  try {
    const conversation = await req.db
      .from("conversation")
      .insert({ created: date_created, name: name });

    for (let i = 0; i < participants.length; i++) {
      await req.db.from("conversations").insert({
        conversation_id: conversation[0],
        participant: participants[i],
      });
    }

    res.status(201).json({ conversation: conversation[0], participants: participants });
  } catch (err) {}
});

module.exports = router;
