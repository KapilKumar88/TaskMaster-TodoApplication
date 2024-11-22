const sendMail = require("../utils/mail.util");
const ejs = require("ejs");
const moment = require("moment");
const { APP_NAME, APP_FRONT_END_APP_URL } = require("../config/app.config");
const logger = require("../utils/winston.util");
const path = require("path");
const { generateRandomToken } = require("./common.helper");
const { encrypt } = require("./encryptDecrypt.helper");
const userService = require("../services/user.service");
const currentYear = new Date().getFullYear();

/**
 * This fucntion will render a welcome email template
 * and will send a mail to the given mail ID
 * @param {name, email} params
 * @returns
 */
const welcomeEmail = async (params) => {
  try {
    const templateStr = await ejs.renderFile(
      path.join(
        __dirname,
        "..",
        "views",
        "email-templates",
        "welcome-email.ejs"
      ),
      {
        username: params.name,
        appname: APP_NAME,
        dashboardURL: `${APP_FRONT_END_APP_URL}/dashboard`,
        currentYear: currentYear,
      }
    );

    return sendMail(params.email, "Welcome Email", templateStr);
  } catch (error) {
    logger.error("Internal server error in Welcome Email function");
    return false;
  }
};

const sendVerificationEmail = async (email, username) => {
  try {
    const randomToken = generateRandomToken();
    const expiryTime = moment().add(60, "m").unix();
    const encryptedObject = encrypt(
      JSON.stringify({
        token: randomToken,
        expiryTime: expiryTime,
        email: email,
      })
    );
    await userService.updateUserByEmail(email, {
      emailVerificationToken: randomToken,
    });

    const templateStr = await ejs.renderFile(
      path.join(
        __dirname,
        "..",
        "views",
        "email-templates",
        "verification-email.ejs"
      ),
      {
        username: username,
        appname: APP_NAME,
        verificationURL: `${APP_FRONT_END_APP_URL}/email-verification?token=${encryptedObject}&email=${encodeURIComponent(
          email
        )}`,
        currentYear: currentYear,
      }
    );

    return sendMail(email, "Verification Email", templateStr);
  } catch (error) {
    logger.error("Internal server error in sendVerificationEmail");
    return false;
  }
};

const sendForgotPasswordEmail = async (email, username) => {
  try {
    const randomToken = generateRandomToken();
    const expiryTime = moment().add(10, "m").unix();
    const encryptedObject = encrypt(
      JSON.stringify({
        token: randomToken,
        expiryTime: expiryTime,
        email: email,
      })
    );

    await userService.updateUserByEmail(email, {
      resetPasswordToken: randomToken,
    });

    const templateStr = await ejs.renderFile(
      path.join(
        __dirname,
        "..",
        "views",
        "email-templates",
        "forgot-password.ejs"
      ),
      {
        username: username,
        appName: APP_NAME,
        resetPasswordURL: `${APP_FRONT_END_APP_URL}/reset-password?token=${encryptedObject}`,
        currentYear: currentYear,
      }
    );

    return sendMail(
      email,
      `Reset Password Instruction for the ${APP_NAME} Account`,
      templateStr
    );
  } catch (error) {
    logger.error("Internal server error in sendForgotPasswordEmail");
    return false;
  }
};

module.exports = {
  welcomeEmail,
  sendVerificationEmail,
  sendForgotPasswordEmail,
};
