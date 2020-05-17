const express = require("express");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const MongoClient = require("mongodb").MongoClient;
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const posts = require("./routes/api/posts");
const upload = require("./routes/api/upload");

const keys = require("./config/keys");
const refreshToken = require("./validation/tokenRefresh");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const dbURL = require("./config/keys").mongoURI;
let database = null;
const dbName = "test";

function connectdb() {
  MongoClient.connect(dbURL, (err, client) => {
    console.log("Connected to TuneBooth Database");
  });
}
connectdb();

app.use(passport.initialize());

require("./config/passport")(passport);

app.use("/api/users", refreshToken, users);
app.use("/api/profiles", refreshToken, profiles);
app.use("/api/posts", refreshToken, posts);
app.use("/api/upload", upload);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
