require("dotenv").config();
const db = require("../config/db.config"); // models path
const { users } = db;

const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const constants = require("../utils/constants");
const helperFunctions = require("../utils/helperFunctions");


// find user logic
exports.findUser = (data) => {
  return new Promise((resolve, reject) => {
    users.findAll({
      where: { email: data.email, is_delete: 0, is_testdata: data.is_testdata },
      attributes: {
        exclude: ["created_at", "updated_at", "is_testdata", "is_delete"]
      }
    }).then((result) => {
      try {
        if (result && result.length > 0) {
          resolve({
            status: 1,
            message: "data found",
            data: result,
          });
        } else {
          // resolve(0);
          resolve({ status: 2, message: "No data found" });
        }
      } catch (err) {
        resolve({
          status: 0,
          message: "Error occurred while fetching User",
        });
      }
    });
  });
};

// exports.findUserForAuth = (data) => {
//   return new Promise((resolve, reject) => {
//     user.findAll({
//       where: { email: data, is_delete: 0 },
//       attributes: {
//         exclude: ["created_at", "updated_at", "is_testdata", "is_delete"]
//       }
//     }).then((result) => {
//       try {
//         if (result && result.length > 0) {
//           resolve({
//             status: 1,
//             message: "data found",
//             data: result,
//           });
//         } else {
//           // resolve(0);
//           resolve({ status: 2, message: "No data found" });
//         }
//       } catch (err) {
//         resolve({
//           status: 0,
//           message: "Error occurred while fetching User",
//         });
//       }
//     });
//   });
// };


exports.findUserById = (data) => {
  return new Promise((resolve, reject) => {
    // users.findAll({ where: { id: data }, attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete"] } }).then((result) => {
    users.findAll({ where: { id: data.id, is_delete: 0, is_testdata: 1}, attributes: { exclude: ["created_at", "updated_at", "is_testdata"] } }).then((result) => {
      try {
        if (result.length > 0) {
          resolve({
            status: 1,
            message: "data found",
            data: result,
          });
        } else {
          resolve(0);
          resolve({ status: 2, message: "No data found" });
        }
      } catch (err) {
        resolve({
          status: 0,
          message: "Error occurred while fetching User",
        });
      }
    });
  });
};

// APIS

// exports.getUserProfile = async (req, res) => {
//   try {
//     // if (!req.body) {
//     //   res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content cannot be empty!"))
//     //   return;
//     // }

//     // console.log(req.decoded);
//     if (!req.decoded) {
//       res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("You are unauthorized to access this api! Please check the authorization token."));
//       return;
//     }

//     var errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
//       return;
//     }

//     if (!req.headers['is_testdata']) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject("is_testdata is required"))
//       return;
//     }

//     const decoded = req?.decoded;

//     const data = await user.findAll({
//       where: { id: decoded?.id, is_delete: 0, is_testdata: req.headers['is_testdata'] },
//       // attributes: ['id', 'user_name', 'email', 'profile']
//     })

//     let return_data = helperFunctions.removeKeyCustom(data[0]?.dataValues, "password");
//     return_data = helperFunctions.removeKeyCustom(return_data, "uuid");
//     return_data = helperFunctions.removeKeyCustom(return_data, "device_token");
//     return_data = helperFunctions.removeKeyCustom(return_data, "is_experienced");
//     return_data = helperFunctions.removeKeyCustom(return_data, "is_verified");
//     return_data = helperFunctions.removeKeyCustom(return_data, "is_delete");
//     return_data = helperFunctions.removeKeyCustom(return_data, "is_testdata");
//     return_data = helperFunctions.removeKeyCustom(return_data, "created_at");
//     return_data = helperFunctions.removeKeyCustom(return_data, "updated_at");

//     if (data?.length > 0) {

//       const user_details = await details.findAll({
//         where: { user_id: data[0].id, is_delete: 0, is_testdata: req.headers['is_testdata'] },
//         attributes: {
//           exclude: ["created_at", "updated_at", "is_testdata", "is_delete"],
//         }
//       });

//       const departmentdData = await departments.findAll({
//         where: { id: user_details[0].department_id, is_delete: 0, is_testdata: req.headers['is_testdata'] },
//         attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete"] },
//       });

//       const responseData = {
//         id: data[0]?.id,
//         profile: data[0]?.profile,
//         first_name: data[0]?.first_name,
//         middle_name: data[0]?.middle_name,
//         last_name: data[0]?.last_name,
//         email: data[0]?.email,
//         date_of_birth: data[0]?.date_of_birth,
//         attorny_registration_number: user_details[0].attorny_registration_number,
//         new_york_state_admission_date_month: user_details[0].new_york_state_admission_date_month,
//         new_york_state_admission_date_day: user_details[0].new_york_state_admission_date_day,
//         new_york_state_admission_date_year: user_details[0].new_york_state_admission_date_year,
//         department_of_admission: departmentdData[0].department,
//         biennial_reporting_date: user_details[0].biennial_reporting_date,
//         is_experienced: user_details[0].is_experienced,
//         required_credits: user_details[0].required_credits,
//         required_date: user_details[0].required_date
//       }

//       res.status(responseCode.OK).send(responseObj.successObject(null, responseData));
//     } else {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.NOUSER));
//     }
//   } catch (err) {
//     res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
//   }
// }

// const transporter = nodemailer.createTransport({
//   host: constants.MAILDATA.TRANSPORTERDATA.HOST,
//   port: constants.MAILDATA.TRANSPORTERDATA.PORT,
//   secure: true, // use SSL
//   auth: {
//     user: constants.MAILDATA.TRANSPORTERDATA.AUTH.USER,
//     pass: constants.MAILDATA.TRANSPORTERDATA.AUTH.PASS,
//   },
// });

// send mail logic
// exports.sendMail = async (template_name, options, data) => {
//   return new Promise((resolve, reject) => {
//     let emailTemplate;
//     ejs
//       .renderFile(constants.TEMPLATE_PATHS.FORGOT_PASS, {
//         reset_link: options.reset_link,
//         user_name: options.user_name,
//       })
//       .then((result) => {
//         emailTemplate = result;
//         const mailOptions = {
//           from: constants.MAILDATA.SENDERADRESS, // sender address
//           to: options.to, // list of receivers
//           subject: options.subject, // Subject line
//           html: emailTemplate, // html body
//         };
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             resolve({ status: 0, error: error });
//           } else {
//             resolve({ status: 1, message: info });
//           }
//         });
//       });
//   });
// };

// exports.sendVerificationMail = async (options, data) => {
//   return new Promise((resolve, reject) => {
//     let emailTemplate;
//     ejs
//       .renderFile(constants.TEMPLATE_PATHS.VERIFY_EMAIL, {
//         // verify_link: options.verify_link,
//         otp: options.otp,
//         user_name: options.user_name,
//         email: options.email,
//         date: options.date
//       })
//       .then((result) => {
//         emailTemplate = result;
//         const mailOptions = {
//           from: constants.MAILDATA.SENDERADRESS, // sender address
//           to: options.to, // list of receivers
//           subject: options.subject, // Subject line
//           html: emailTemplate, // html body
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             resolve({ status: 0, error: error });
//           } else {
//             resolve({ status: 1, message: info });
//           }
//         });
//       })
//       .catch((err) => {
//         console.log("sendVerificationMail Error: ", err);
//       });
//   });
// };

// exports.changePassword = async (req, res) => {
//   try {
//     if (!req?.body) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.CONTENTISREQUIRED));
//       return;
//     }

//     if (!req.decoded) {
//       res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject(constants.MSG.UNAUTHORIZEDREQUEST));
//       return;
//     }

//     if (!req.headers['is_testdata']) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.TESTDATAISREQUIRED));
//       return;
//     }

//     var errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
//       return;
//     }

//     const decoded = req?.decoded;

//     const requestData = {
//       id: decoded?.id,
//       is_testdata: req.headers['is_testdata'],
//     }

//     const user_data = await this.findUserById(requestData);

//     if (user_data?.status == 1) {
//       const is_password_verified = helperFunctions.verifyPassword(req.body?.old_password, user_data?.data[0]?.password);
//       if (is_password_verified) {
//         const new_password = helperFunctions.hashPassword(req.body?.new_password);

//         const data = await user.update({ password: new_password }, { where: { id: decoded?.id, is_testdata: requestData.is_testdata } });

//         if (data[0] == 1) {
//           res.status(responseCode.OK).send(responseObj.successObject(constants.MSG.CHANGEPASSWORDSUCCESS));
//         } else {
//           res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.CHANGEPASSWORDFAILED));
//         }
//       } else {
//         res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.INCORRECTPASSWORD));
//       }
//     } else {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.NOUSER));
//     }

//   } catch (err) {
//     res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
//   }
// }

// exports.deleteAccount = async (req, res) => {
//   try {
//     if (!req.decoded) {
//       res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject(constants.MSG.UNAUTHORIZEDREQUEST));
//       return;
//     }

//     var errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
//       return;
//     }

//     if (!req.headers['is_testdata']) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.TESTDATAISREQUIRED));
//       return;
//     }

//     const decoded = req?.decoded;

//     const requestData = {
//       id: decoded?.id,
//       is_testdata: req.headers['is_testdata'],
//     }

//     const user_data = await this.findUserById(requestData);

//     if (user_data?.status == 1) {
//       const data = await user.update({ is_delete: 1 }, { where: { id: decoded?.id, is_testdata: requestData.is_testdata } });
//       if (data[0] == 1) {
//         res.status(responseCode.OK).send(responseObj.successObject(constants.MSG.DELETEACCOUNTSUCCESS));
//       } else {
//         res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.DELETEACCOUNTFAILED));
//       }

//     } else {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.NOUSER));
//     }

//   } catch (err) {
//     res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
//   }
// }

// exports.logout = async (req, res) => {
//   try {
//     if (!req.decoded) {
//       res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject(constants.MSG.UNAUTHORIZEDREQUEST));
//       return;
//     }

//     var errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
//       return;
//     }

//     if (!req.headers['device_token'] || !req.headers['device_type'] || !req.headers['is_testdata']) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.HEADERSAREREQUIRED));
//       return;
//     }

//     const decoded = req?.decoded;

//     const requestData = {
//       id: decoded?.id,
//       is_testdata: req.headers['is_testdata'],
//     }

//     const user_data = await this.findUserById(requestData);

//     if (user_data?.status == 1) {
//       const deviceData = await deviceToken.findAll({ where: { user_id: decoded?.id, device_type: req.headers['device_type'], device_token: req.headers['device_token'], is_testdata: requestData.is_testdata } });

//       if (deviceData.length > 0) {

//         const data = await deviceToken.destroy({ where: { user_id: decoded?.id, device_type: req.headers['device_type'], device_token: req.headers['device_token'], is_testdata: requestData.is_testdata } });
//         if (data) {
//           res.status(responseCode.OK).send(responseObj.successObject(constants.MSG.LOGOUTSUCESS));
//         } else {
//           res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.LOGOUTFAILED));
//         }

//       } else {
//         res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.DEVICEDATAFAILED));
//       }

//     } else {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.NOUSER));
//     }

//   } catch (err) {
//     res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
//   }
// }


// exports.updateProfile = async (req, res) => {
//   try {
//     if (!req?.body) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.CONTENTISREQUIRED));
//       return;
//     }

//     if (!req.decoded) {
//       res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject(constants.MSG.UNAUTHORIZEDREQUEST));
//       return;
//     }

//     var errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
//       return;
//     }

//     if (!req.headers['is_testdata']) {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.TESTDATAISREQUIRED));
//       return;
//     }

//     const decoded = req?.decoded;

//     const requestData = {
//       id: decoded?.id,
//       is_testdata: req.headers['is_testdata'],
//     }
//     let updated_user = {};
//     let updated_user_details = {};
//     let img;
//     if (req.files && req.files['profile']) {
//       img = (await uploadFile(req, res))[0]?.name
//     }

//     if (img) {
//       updated_user["profile"] = img;
//     }

//     if (req.body?.first_name) {
//       updated_user['first_name'] = req.body?.first_name
//     }

//     if (req.body?.middle_name) {
//       updated_user['middle_name'] = req.body?.middle_name
//     }

//     if (req.body?.last_name) {
//       updated_user['last_name'] = req.body?.last_name
//     }

//     if (req.body?.email) {
//       updated_user['email'] = req.body?.email
//     }

//     if (req.body?.date_of_birth) {
//       updated_user['date_of_birth'] = req.body?.date_of_birth
//     }

//     if (req.body?.attorny_registration_number) {
//       updated_user_details['attorny_registration_number'] = req.body?.attorny_registration_number
//     }

//     if (req.body?.new_york_state_admission_date_month) {
//       updated_user_details['new_york_state_admission_date_month'] = req.body?.new_york_state_admission_date_month
//     }

//     if (req.body?.new_york_state_admission_date_day) {
//       updated_user_details['new_york_state_admission_date_day'] = req.body?.new_york_state_admission_date_day
//     }

//     if (req.body?.new_york_state_admission_date_year) {
//       updated_user_details['new_york_state_admission_date_year'] = req.body?.new_york_state_admission_date_year
//     }

//     // if (req.body?.department_of_admission) {
//     //   updated_user_details['department_of_admission'] = req.body?.department_of_admission
//     // }

//     if (req.body?.department_id) {
//       updated_user_details['department_id'] = req.body.department_id
//     }

//     if (req.body?.biennial_reporting_date) {
//       updated_user_details['biennial_reporting_date'] = req.body?.biennial_reporting_date
//     }

//     const user_data = await this.findUserById(requestData);

//     if (user_data?.status == 1) {


//       if (updated_user) {
//         const data = await user.update(updated_user, { where: { id: decoded?.id, is_delete: 0, is_testdata: requestData.is_testdata } })

//         if (data) {

//           if (updated_user_details) {

//             console.log("//////");
//             console.log(decoded?.id);

//             const detailsData = await details.update(updated_user_details, { where: { user_id: decoded?.id, is_delete: 0, is_testdata: requestData.is_testdata } });

//             if (detailsData) {

//               const getDetails = await details.findAll({ where: { user_id: decoded?.id, is_delete: 0, is_testdata: requestData.is_testdata } });
//               const requireDate = getDetails[0].biennial_reporting_date;

//               await details.update({ required_date: requireDate }, { where: { user_id: decoded?.id, is_delete: 0, is_testdata: requestData.is_testdata } });

//               await user.findAll({
//                 where: { id: decoded?.id, is_delete: 0, is_testdata: requestData.is_testdata },
//                 attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete", "uuid", "device_token", "is_verified", "password", "is_experienced"] }
//               }).then(async (result) => {
//                 console.log(result[0]);
//                 const userDetailsResponseData = await details.findAll({
//                   where: { user_id: result[0].id, is_delete: 0, is_testdata: requestData.is_testdata },
//                   attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete", "uuid", "device_token", "is_verified", "password", "is_experienced"] }
//                 })

//                 const departmentdData = await departments.findAll({
//                   where: { id: userDetailsResponseData[0].department_id, is_delete: 0, is_testdata: requestData.is_testdata },
//                   attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete"] },
//                 });

//                 const responseData = {
//                   id: result[0]?.id,
//                   profile: result[0]?.profile,
//                   first_name: result[0]?.first_name,
//                   middle_name: result[0]?.middle_name,
//                   last_name: result[0]?.last_name,
//                   email: result[0]?.email,
//                   date_of_birth: result[0]?.date_of_birth,
//                   attorny_registration_number: userDetailsResponseData[0].attorny_registration_number,
//                   new_york_state_admission_date_month: userDetailsResponseData[0].new_york_state_admission_date_month,
//                   new_york_state_admission_date_day: userDetailsResponseData[0].new_york_state_admission_date_day,
//                   new_york_state_admission_date_year: userDetailsResponseData[0].new_york_state_admission_date_year,
//                   department_of_admission: departmentdData[0].department,
//                   biennial_reporting_date: userDetailsResponseData[0].biennial_reporting_date,
//                   required_date: userDetailsResponseData[0].required_date,
//                   is_experienced: userDetailsResponseData[0].is_experienced,
//                 }
//                 res.status(responseCode.OK).send(responseObj.successObject(constants.MSG.UPDATEPROFILESUCCESS, responseData));
//               });
//             }

//           } else {
//             res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.UPDATEPROFILENODATA));
//           }

//         } else {
//           res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.UPDATEPROFILEFAILED));
//         }
//       } else {
//         res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.UPDATEPROFILENODATA));
//       }
//     } else {
//       res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.NOUSER));
//     }

//   } catch (err) {
//     res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
//   }
// }

// exports.cleHistory = async (req, res) => {

//   if (!req.decoded) {
//     res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject(constants.MSG.UNAUTHORIZEDREQUEST));
//     return;
//   }

//   if (!req.headers['is_testdata']) {
//     res.status(responseCode.BADREQUEST).send(responseObj.failObject(constants.MSG.TESTDATAISREQUIRED));
//     return;
//   }

//   var errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
//     return;
//   }

//   const decoded = req?.decoded;

//   const userData = await user.findAll({
//     where: { id: decoded?.id, is_delete: 0, is_testdata: req.headers['is_testdata'] },
//   });


//   if (userData.length > 0) {

//     const userDetails = await db.details.findAll({
//       where: { user_id: userData[0].id, is_delete: 0, is_testdata: req.headers['is_testdata'] },
//     })

//     if (userDetails.length > 0) {

//       try {
//         const categoryData = await categories.findAll({
//           where: { is_delete: 0, is_testdata: req.headers['is_testdata'] },
//           attributes: ['id', 'category'],
//         });

//         const categoryDetails = [];
//         const year = req.query.year;

//         for (const category of categoryData) {
//           const categoryId = category.id;
//           const categoryName = category.category;

//           const cleData = await cleTracker.findAll({
//             where: {
//               user_id: userData[0].id,
//               category_id: categoryId,
//               is_archived: 1,
//               is_delete: 0,
//               is_testdata: req.headers['is_testdata'],
//               cle_date: {
//                 [Sequelize.Op.and]: [
//                   Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('cle_date')), year),
//                   Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('cle_date')), '>=', 1),
//                   Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('cle_date')), '<=', 12)
//                 ]
//               }
//             },
//             attributes: ['id', 'cle_name', 'cle_date', 'is_archived'],
//             include: [
//               {
//                 model: credits,
//                 as: "credits",
//                 where: { is_delete: 0 },
//                 attributes: ['creditsEarned'],
//                 required: false,
//               },
//               {
//                 model: documents,
//                 as: "documents",
//                 where: { is_delete: 0 },
//                 attributes: ['id', 'document'],
//                 required: false,
//               }
//             ],
//           });

//           categoryDetails.push({
//             category_id: categoryId,
//             category_name: categoryName,
//             cle_data: cleData,
//           });

//         }

//         res.status(responseCode.OK).send(responseObj.successObject(null, { categoryDetails }));

//       } catch (err) {
//         res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
//       }
//     }
//   }

// }


// exports.sendMailToAdmin = async (options) => {
//   return new Promise((resolve, reject) => {
//     let emailTemplate;
//     ejs
//       .renderFile(constants.TEMPLATE_PATHS.MAILTOADMIN, {
//         user_email: options.user_email,
//         user_name: options.user_name,
//         user_message: options.user_message,
//         date: options.date
//       })
//       .then((result) => {
//         emailTemplate = result;
//         const mailOptions = {
//           from: constants.MAILDATA.SENDERADRESS, // sender address
//           to: options.to, // list of receivers
//           subject: options.subject, // Subject line
//           html: emailTemplate, // html body
//         };
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             resolve({ status: 0, error: error });
//           } else {
//             resolve({ status: 1, message: info });
//           }
//         });
//       }).catch((err) => {
//         console.log("Error: ", err);
//       });
//   });
// };
