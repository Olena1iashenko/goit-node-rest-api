import nodemailer from "nodemailer";
import "dotenv/config.js";

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return transport
    .sendMail(email)
    .then((response) => console.log("Email send succeess"))
    .catch((error) => console.log(error.message));
};

export default sendEmail;

// const email data = {
//   from: UKR_NET_EMAIL,
//   to: "lyashenko.alenkaa@gmail.com",
//   subject: "Test email",
//   html: "<strong>Test email</strong>",
// };
