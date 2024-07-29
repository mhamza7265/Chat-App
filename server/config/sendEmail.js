const nodemailer = require("nodemailer");

function sendEmail(user, data, type, userName) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "servetechlahore@gmail.com",
        pass: "buno gcvh zupa odfx",
      },
    });

    const mailOptions = {
      from: "auth.new.taske@gmail.com",
      to: user,
      subject:
        type == "order"
          ? "New Order"
          : type == "statusChange"
          ? "Order Status Change"
          : type == "verifyUser"
          ? "Account Verification"
          : "Password Reset Request",
      html:
        type == "order"
          ? order(data)
          : type == "statusChange"
          ? statusChanged(data, userName)
          : type == "verifyUser"
          ? verify(data, userName)
          : resetPassword(data, userName),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.error("Error sending email: ", error);
        return reject({ status: false, error: "Error sending email" });
      } else {
        // console.log("Email sent: ", info.response);
        return resolve({ status: true, message: info.response });
      }
    });
  });
}

function verify(data, userName) {
  const html = `<div style="background-color: gray, border: 1px solid #5f6d66, border-radius: 5px, padding: 5px"><h2>Hello ${userName},</h2><span>Please use bellow pin for verification.</span><h2 style='color: red; padding: 10px; background-color: #000; width: max-content'>${data}</h2><p>Enter the code to verify your account.</p><p style="text-decoration: underline; font-style: italic;">The React Team</p></div>`;
  return html;
}

function resetPassword(data, userName) {
  const html = `<div style="background-color: gray, border: 1px solid #5f6d66, border-radius: 5px, padding: 5px"><h2>Hello ${userName},</h2><span>Please use bellow link to reset your password</span><a href="http://localhost:5173/reset-password?token=${data}" style="display: block">Reset Password</a><p style="text-decoration: underline; font-style: italic;">The React Team</p></div>`;
  return html;
}

function order(data) {
  const html = `<div style="background-color: gray, border: 1px solid #5f6d66, border-radius: 5px, padding: 5px"><h2>Hello <span style="fornt-weight: bold; font-style: italic">Admin</span>,</h2><p>An Order has been placed by ${data}</p><p>Go to <a href="http://localhost:5173/admin" style="font-weight: bold">dashboard</a> to view the order.</p><p style="text-decoration: underline; font-style: italic;">React Team</p></div>`;
  return html;
}

function statusChanged(data, userName) {
  const html = `<div style="background-color: gray, border: 1px solid #5f6d66, border-radius: 5px, padding: 5px"><h2>Hello ${userName},</h2><p>Your order is ${data}</p><p style="text-decoration: underline; font-style: italic;">The React Ecommerce Team</p></div>`;
  return html;
}

module.exports = sendEmail;
