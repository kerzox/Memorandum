var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/:conversation_id", async function (req, res, next) {
  try {

    const { conversation_id } = req.params
    const { text, sender_id, recipient_id } = req.body;

    const messages = await req.db.from("messages").insert({conversation_id, text, sender_id, recipient_id})

    res.status(201).json("Message sent")

  } catch (err) {
    console.log(err)
  }
});

router.get("/:conversation_id", async function (req, res, next) {
  try {

    const { conversation_id } = req.params

    const messages = await req.db.from("messages").select("*").where({conversation_id})

    res.status(200).json({
      messages
    })

  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
