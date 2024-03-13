const jwt = require("jsonwebtoken");

const user_cont = require("../controller/user.controller");
const responseStatus = require("../utils/responseStatus");
const responseObjects = require("../utils/responseObjects");

module.exports = async function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"] || req.authorization;

    const parts = token?.split("Bearer ");
    if (parts?.length > 0) {
      token = parts[1];
    }
  console.log(token)
  // const demodecode = jwt.decode(token);
  // console.log({"//// Demo Decode ////": demodecode});

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, async function (err, decoded) {
      // if (err) {
      //   return res.status(responseStatus.UNAUTHORIZEDREQUEST).send({ message: err.message });
      // }

      // // const login_user = (await user_cont.findUser(decoded?.email))?.data[0];
      // const login_user = (await user_cont.findUserForAuth(decoded?.email))?.data[0];

      // console.log("/////");
      // console.log(login_user);

      // if (login_user?.uuid == decoded?.uuid) {
      //   console.log("Token Data: ", decoded);
      //   req.decoded = decoded;
      //   next();
      // } else {
      //   return res.status(responseStatus.UNAUTHORIZEDREQUEST).send(responseObjects.failObject("Auth Token is invalid."));
      // }
      // // else {
      // //   console.log("Token Data: ", decoded);
      // //   req.decoded = decoded;
      // //   next();
      // // }
      if (err) {
        console.log('=============== JWT VERIFY ERR =====================');
        console.log(err);
        console.log('====================================');
        return res.status(401).send({ status: process.env.FAILED, message: 'Unauthorized access!!' });
      }
      else {
        console.log('=============== JWT VERIFY SUCCESS =====================');
        console.log(decoded);
        console.log('====================================');
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(responseStatus.UNAUTHORIZEDREQUEST).send(responseObjects.failObject("Unauthorized access"));
  }
};
