const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const refreshToken = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
      if (decoded) {
        console.log(decoded);
        // let tokenDate = new Date(decoded.tokenDate);
        // let dateDiff = Date.now() - tokenDate;
        // dateDiff = Math.round(dateDiff / 1000 / 60 / 60 / 24);

        // // refresh token after every 7 days
        // if (dateDiff >= 7) {
        const payload = {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          tokenDate: Date.now(),
        };
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: "14d" },
          (err, token) => {
            req.token = "Bearer " + token;
            // res.json({ status: "refresh_success", token: "Bearer " + token });
            console.log("Token Generated");
          }
        );
        // } else {
        //   // res.json({ status: "refresh_failed" });
        //   console.log("Token Not Generated");
        // }
      }
    });
    next();
  } else {
    next();
    return null;
  }
};

module.exports = refreshToken;

// export default refreshToken;
