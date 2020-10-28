const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/sync", (req, res) => {
  Message.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});

router.post("/new", (req, res) => {
  const newMessage = req.body;

  Message.create(newMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).send(`new message created: \n ${data}`);
  });
});

module.exports = router;
