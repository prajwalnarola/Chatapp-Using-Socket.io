module.exports = {
  TEMPLATE_PATHS: {
    FORGOT_PASS: process.cwd() + "/app/emails/reset_password/html.ejs", //PROCESS.CWD() IS GIVES FULL WORKING DIRECTORY PATH.
    SUCCESS_200: process.cwd() + "/app/templates/200_SUCCESS.ejs",
    ERROR_400: process.cwd() + "/app/templates/400_ERROR.ejs",
    ERROR_401: process.cwd() + "/app/templates/401_ERROR.ejs",
    ERROR_404: process.cwd() + "/app/templates/404_ERROR.ejs",
    ERROR_500: process.cwd() + "/app/templates/500_ERROR.ejs",
    RESET_PASS_FORM: process.cwd() + "/app/templates/reset_password.ejs",
    VERIFY_EMAIL: process.cwd() + "/app/templates/verify_email.ejs",
    EMAIL_VERIFIED: process.cwd() + "/app/templates/email_verified.ejs",
    MAILTOADMIN: process.cwd() + "/app/templates/mail_to_admin.ejs",
  },

  MSG: {
    SUCCESS: "Success",
    FAILED: "Failed",
    EMAILALREADYEXIEST: "This email id is already registered.",
    SOMETHINKWROUNG: "Something went wrong.",
    INVALIDPLATFORM: "Invalid platform!",
    SOMETHINKWROUNGUSERDATA : "Something went wrong while inserting user data.",
    SOMETHINKWROUNGDETAILSDATA : "Something went wrong while inserting details data.",
    MAILERROR: "Error occured while sending mail.",
    SUCCESSFULLYREGISTER: "Registered successfully.",
    UNAUTHORIZEDREQUEST: "You are unauthorized to access this api! Please check the authorization token.",
    CONTENTISREQUIRED: "Content is required.",
    TESTDATAISREQUIRED: "is_testdata is required.",
    // NOUSER: "Something went wrong while finding user.",
    NOUSER: "User account does not exist.",
    NOUSERDETAILS: "User details does not exist.",
    EMAILVERIFIED: "Email verified successfully.",
    INVALIDOTP: "Invalid OTP!",
    NOTVERIFIEDUSERMAILSUCCESS: "Email is not verified, OTP sent on email!",
    MAILSUCCESS: "A new OTP has been sent to your mail.",
    FORGOTPASSWORDSUCCESS: "Success! An OTP has been sent to your email address. Please check your inbox",
    LOGINSUCCESS: "Login successfully.",
    INCORRECTPASSWORD: "Incorrect password!",
    OTPMAILSUCCESS: "OTP sent on email!",
    RESETPASSWORDSUCCESS: "Password changed successfully.",
    RESETPASSWORDFAILED: "Something went wrong updating the password.",
    EMAILALREADYVERIFIED: "email is already verified.",
    CHANGEPASSWORDSUCCESS: "password changed successfully.",
    CHANGEPASSWORDFAILED: "Something went wrong updating the password.",
    DELETEACCOUNTSUCCESS: "Account deleted successfully.",
    DELETEACCOUNTFAILED: "Something went wrong deleting the account.",
    HEADERSAREREQUIRED: "headers are required.",
    LOGOUTSUCESS: "Logout successfully.",
    LOGOUTFAILED: "Something went wrong logging out the account.",
    DEVICEDATAFAILED: "No log in found.",
    UPDATEPROFILESUCCESS: "Profile updated successfully.",
    UPDATEPROFILENODATA: "Something went wrong! No data to update.",
    UPDATEPROFILEFAILED: "Something went wrong while updating the user profile.",
    POSTCLESUCCESS: "Data has been inserted",
    DOCUMENTSIZEERROR: "Documents size exceeds 5 MB limit",
    DELETECLESUCCESS: "CLE removed successfully",
    NOCLE: "No such CLE",
    SUBMITCLESUCCESS: "Success/Archived & manually updated required date",
    ARCHIVEERROR: "Something went wrong while archiving cle",
    UPDATINGREQUIREDDATEERROR: "Something went wrong while updating required date",
    DATEISPASSED :"RequireDate has already passed",
    LESSCREDITS: "RequireDate has already passed",
    UPDATINGCREDITSERROR:"Something went wrong updating credits",
    UPDATECLESUCCESS: "CLE updated successfully",
    UPDATECLEFAILED: "Something went wrong! No data to update.",
    CONTACTUSSUCESS: "Your message has been successfully received. Our team will review it and get back to you as soon as possible."
  },

  MAILDATA: {
  VERIFY_EMAIL: "Please verify your email for CLE Tracker",
  TRANSPORTERDATA : {
    HOST: "smtp.gmail.com",
    PORT: 465,
    AUTH: {
      USER: "narolaios@gmail.com",
      PASS: "feksopjnxvwbbzgf"
    }
  },
  SENDERADRESS: "narolaios@gmail.com",
  ADMINMAIL: "cletrackerapp@gmail.com",
  ADMINMAILSUBJECT: "Query Regarding CLE Tracker",
  }

};


