require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const JWTFunctions = require("../Helpers/JWTFunctions");

const db = require("../config/db.config"); // models path
const { users, deviceToken } = db;

const userControl = require("./user.controller");
const functions = require("../utils/helperFunctions");
const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const constants = require("../utils/constants");
const { sendPushNotification } = require("../routes/pushNotificationService.routes");


exports.refreshToken = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(responseCode.BADREQUEST).json({ errors: errors?.errors[0]?.msg });
  }
  if (errors.isEmpty()) {
    const platform = req.query.platform;
    if (platform === process.env.PLATFORM_iOS || platform === process.env.PLATFORM_ANDROID || platform === process.env.PLATFORM_POSTMAN) {
      const token = JWTFunctions.generateTokenWithoutAuth(platform);
      res.status(responseCode.OK).send(responseObj.successObject(null, token));
      return;
    }
    res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject(constants.MSG.INVALIDPLATFORM));
  }
}

exports.register = async (req, res) => {
  try {
    if (!req.body.email) {
      throw { message: "Content can not be empty!" };
    }

    if (!req.headers['is_testdata']) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.TESTDATAISREQUIRED));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw {
        status: responseCode.BADREQUEST,
        message: errors?.errors[0]?.msg,
      };
    }

    const requestData = {
      email: req.body.email,
      is_testdata: req.headers['is_testdata'],
    }

    const user_email = await userControl.findUser(requestData);
    if (user_email.status === 1) {
      throw { message: constants.MSG.EMAILALREADYEXIEST };
    } else {
      const create_user = {
        name: req.body.name,
        email: requestData.email,
        password: req.body.password,
        is_testdata: requestData.is_testdata
      };

      const data = await users.create(create_user);
      if (data) {
        res
          .status(responseCode.OK)
          .send(
            responseObj.successObject(
              constants.MSG.SUCCESSFULLYREGISTER,
            )
          );

      } else {
        res.send({ message: constants.MSG.SOMETHINKWROUNGUSERDATA });
      }
    }
  } catch (err) {
    if (err?.message) {
      if (Object.keys(err).length == 1) {
        res
          .status(responseCode.BADREQUEST)
          .send(responseObj.failObject(err?.message ?? null));
      } else {
        res
          .status(err?.status ?? responseCode.BADREQUEST)
          .send(
            responseObj.failObject(
              err?.message ?? null,
              err?.status ? null : err
            )
          );
      }
    } else {
      console.log("Error: ", err);
      res
        .status(responseCode.BADREQUEST)
        .send(responseObj.failObject(null, err));
    }
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body) {
      throw { message: constants.MSG.CONTENTISREQUIRED };
    }

    if (!req.headers['device_token'] || !req.headers['device_type'] || !req.headers['is_testdata']) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.HEADERSAREREQUIRED));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { message: errors?.errors[0]?.msg };
    }

    const requestData = {
      email: req.body.email,
      is_testdata: req.headers['is_testdata'],
    }
    const user_email = await userControl.findUser(requestData);

    if (user_email.status === 0) {
      throw { status: responseCode.INTERNALSERVER_ERROR, message: constants.MSG.NOUSER };
    } else if (user_email.status === 1) {

      console.log("====================");
      console.log("USER ID :", user_email.data[0].id);

      if (functions.verifyPassword(req.body?.password, user_email.data[0]?.password) && req.body.email.toLowerCase() == user_email.data[0].email.toLowerCase()) {

        const jwt_data = { id: user_email.data[0].id, email: user_email.data[0].email, uuid: user_email.data[0].uuid };
        const token = jwt.sign(jwt_data, process.env.ACCESS_TOKEN_SECRET_KEY);

        const responseData = {
          id: user_email.data[0]?.id,
          name: user_email.data[0]?.name,
          email: user_email.data[0]?.email,
        }

        console.log(responseData);

        let return_data = functions.removeKeyCustom(responseData, "password");
        // let return_data = functions.removeKeyCustom(user_email.data[0]?.dataValues, "password");
        return_data = functions.removeKeyCustom(return_data, "is_delete");
        return_data = functions.removeKeyCustom(return_data, "is_testdata");
        return_data = functions.removeKeyCustom(return_data, "created_at");
        return_data = functions.removeKeyCustom(return_data, "updated_at");
        // if (return_data?.profile != null) {
        //   return_data["profile"] = process.env.UPLOAD_URL + return_data?.profile;
        // }

        const create_deviceToken = {
          user_id: user_email.data[0].id,
          device_type: req.headers['device_type'],
          device_token: req.headers['device_token'],
          is_testdata: requestData.is_testdata,
        };

        const data = await deviceToken.create(create_deviceToken);

        res.status(responseCode.OK).send({ ...responseObj.successObject(constants.MSG.LOGINSUCCESS, { user_info: return_data, token: token }) });

      } else {
        throw { status: responseCode.BADREQUEST, message: constants.MSG.INCORRECTPASSWORD };
      }
    } else {
      throw { status: responseCode.BADREQUEST, message: constants.MSG.NOUSER };
    }
  } catch (err) {
    if (err?.message) {
      res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.message ?? null));
    } else {
      console.log("Error: ", err);
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(null, err));
    }
  }
};

exports.userListing = async (req, res) => {
  try {
    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject(constants.MSG.UNAUTHORIZEDREQUEST));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
      return;
    }

    if (!req.headers['device_token'] || !req.headers['device_type'] || !req.headers['is_testdata']) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.HEADERSAREREQUIRED));
      return;
    }

    const decoded = req?.decoded;

    const requestData = {
      id: decoded?.id,
      is_testdata: req.headers['is_testdata'],
    }

    const user_data = await userControl.findUserById(requestData);

    if (user_data?.status == 1) {
      const usersData = await users.findAll({
        where: {
          is_delete: 0,
          is_testdata: requestData.is_testdata
        },
        attributes: {
          exclude: ["password", "created_at", "updated_at", "is_testdata", "is_delete"]
        }
      });

      if (usersData.length > 0) {

          res.status(responseCode.OK).send(responseObj.successObject(null, usersData));

      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.SOMETHINKWROUNG));
      }

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.NOUSER));
    }

  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
  }
}

exports.logout = async (req, res) => {
  try {
    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject(constants.MSG.UNAUTHORIZEDREQUEST));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
      return;
    }

    if (!req.headers['device_token'] || !req.headers['device_type'] || !req.headers['is_testdata']) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.HEADERSAREREQUIRED));
      return;
    }

    const decoded = req?.decoded;

    const requestData = {
      id: decoded?.id,
      is_testdata: req.headers['is_testdata'],
    }

    const user_data = await userControl.findUserById(requestData);

    if (user_data?.status == 1) {
      const deviceData = await deviceToken.findAll({ where: { user_id: decoded?.id, device_type: req.headers['device_type'], device_token: req.headers['device_token'], is_testdata: requestData.is_testdata } });

      if (deviceData.length > 0) {

        const data = await deviceToken.destroy({ where: { user_id: decoded?.id, device_type: req.headers['device_type'], device_token: req.headers['device_token'], is_testdata: requestData.is_testdata } });
        if (data) {
          res.status(responseCode.OK).send(responseObj.successObject(constants.MSG.LOGOUTSUCESS));
        } else {
          res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.LOGOUTFAILED));
        }

      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.DEVICEDATAFAILED));
      }

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.NOUSER));
    }

  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
  }
}

exports.sendNotification = async (req, res) => {
  const { token, title, body } = req.body;

  try {
    await sendPushNotification(token, title, body);
    res.status(responseCode.OK).send(responseObj.successObject("Notification sent successfully"));
    // res.status(200).send();
  } catch (error) {
    res.status(500).send("Failed to send notification");
  }
}


