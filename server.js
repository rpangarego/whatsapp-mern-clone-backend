// import modules
const express = require("express");
const mongoose = require("mongoose");
const Pusher = require("pusher");
const cors = require("cors");

// app config
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const pusher = new Pusher({
  appId: "1098173",
  key: "f366bec826e3f8d9112c",
  secret: "36b89ade76277f337d22",
  cluster: "ap1",
  useTLS: true
});

// middleware
app.use(express.json());
app.use(cors());

// DB config
const connection_url = `mongodb+srv://${process.env.MongoDB_USERNAME}:${process.env.MongoDB_PASSWORD}@cluster0.gnlt0.mongodb.net/whatsappdb?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => {
  console.log("Connected to MongoDB");
  const msgCollection = db.collection("messages");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;

      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message
      });
    } else {
      console.log("Error triggering Pusher!");
    }
  });
});

// ???

// api routes
app.get("/", (req, res) => {
  res.status(200).send("<h1>Whatsapp MERN Clone API!</h1>");
});

const whatsappRoute = require("./routes/whatsappRoute");
app.use("/messages", whatsappRoute);

// listener
app.listen(PORT, () =>
  console.log(`Server listening to http://localhost:${PORT}`)
);
