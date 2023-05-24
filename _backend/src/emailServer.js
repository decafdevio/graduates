const express = require("express");
const router = express.Router();
const cors = require("cors");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const smtpHost = process.env.smtphost;
const smtpPort = process.env.smtpPort;
const smtpUser = process.env.smtpUser;
const smtpPass = process.env.smtpPass;

const nodemailer = require("nodemailer");

const path = require("path");
/**
 * sendEmail
 * @param {Object} mailObj - Email information
 * @param {String} from - Email address of the sender
 * @param {Array} to - Array of receipents email address
 * @param {String} subject - Subject of the email
 * @param {String} text - Email body
 */
const sendEmail = async (mailObj) => {
  //console.log(mailObj);
  const { from, to, company, subject, text } = mailObj;
  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: from, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    });

    //console.log(`Message sent: ${info.messageId}`);
    return `Message sent: ${info.messageId}`;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Something went wrong in the sendmail method. Error: ${error.message}`
    );
  }
};

module.exports = sendEmail;
