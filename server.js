const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const posts = require("./routes/api/posts");
const upload = require("multer")();
const port = process.env.PORT || 5000;
const keys = require("./config/keys");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const jwt = require("jsonwebtoken");
const redis = require("redis");
const client = redis.createClient();

const refreshToken = require("./validation/tokenRefresh");
// DB config
const dbURL = require("./config/keys").mongoURI;
const Notif = require("./models/NotifModel");
const Post = require("./models/PostModel");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      keys.secretOrKey,
      (err, decoded) => {
        if (err) {
          return next(new Error("Authentication Error"));
        }
        console.log("socket established");
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    console.log("socket error else");
    return next(new Error("Authentication Error"));
  }
}).on("connect", (socket) => {
  console.log("socket in connect: ", socket.decoded);
  socket.on("join", (data) => {
    if (data.userId === socket.decoded.id) {
      console.log("user joined socket");
      socket.join(socket.decoded.id);
      
      // change stream for notifications
      const pipelineNotif = [
        {
          $match: {
            $and: [
              { read: { $eq: false } },
              { user: { $eq: socket.decoded.id } },
            ],
          },
        },
      ];
      const changeStreamNotif = Notif.watch(pipelineNotif);
      changeStreamNotif.on("change", (next) => {
        if (next.operationType === "insert") {
          const doc = next.fullDocument;
          if (doc) {
            io.to(socket.decoded.id).emit("new_notif", { msg: "fetch_notif" });
          }
        }
      });

      const pipelinePost = [
        {
          $match: {},
        },
      ];
      // change stream for posts
      const newPostAdded = `newPostUID_${socket.decoded.id}`;
      client.set(newPostAdded, 0);
      const changeStreamPost = Post.watch(pipelinePost);
      changeStreamPost.on("change", (next) => {
        if (next.operationType === "insert") {
          const doc = next.fullDocument;
          console.log(doc);
          client.get(newPostAdded, (err, reply) => {
            if (reply) {
              if (parseInt(reply) >= 5) {
                io.emit("new_post", { msg: "fetch_post" });
                client.set(newPostAdded, 0);
              } else {
                client.incr(newPostAdded);
              }
            }
          });
        }
      });
    }
  });
});

app.use(passport.initialize());

require("./config/passport")(passport);

app.use("/api/users", refreshToken, users);
app.use("/api/profiles", profiles);
app.use("/api/posts", posts);

server.listen(port, () => console.log(`Server running on port ${port}`));
