const Authentication = require("../models/authenticationModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/sendEmail");
const fs = require("fs");
require("dotenv").config();

const registerUser = async (req, res) => {
  const image = req.files
    ? req.files[0].path.replaceAll("\\", "/").replace("files/", "")
    : undefined;
  try {
    const userFound = await Authentication.findOne({ email: req.body.email });
    if (!userFound) {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(req.body.password, salt);
      const user = await Authentication.create({
        email: req.body.email,
        password: encryptedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        image,
        verified: false,
      });

      return res
        .status(200)
        .json({ status: true, user, message: "Successfully registered!" });
    } else {
      return res
        .status(340)
        .json({ status: false, error: "User already exists!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await Authentication.findOne({ email: req.body.email });
    console.log("user", user);
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        if (user.verified) {
          console.log("verified");
          console.log("secret", process.env.JWT_SECRET);
          const token = jwt.sign(
            {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
            process.env.JWT_SECRET
          );

          return res.status(200).json({
            status: true,
            message: "Successfully logged in",
            token: `Bearer ${token}`,
          });
        } else {
          const randomNum = Math.floor(100000 + Math.random() * 900000);
          await sendEmail(
            req.body.email,
            randomNum,
            "verifyUser",
            user.firstName
          )
            .then((res) => {
              console.log("email", res);
            })
            .catch((err) => {
              console.log("email", err);
            });

          await Authentication.updateOne(
            { email: req.body.email },
            { verification: randomNum }
          );
          return res.status(200).json({
            status: false,
            error:
              "Verification code is sent to your email, please use that to verify your account!",
          });
        }
      } else {
        return res
          .status(401)
          .json({ status: false, error: "Wrong Password!" });
      }
    } else {
      return res
        .status(401)
        .json({ status: false, error: "Wrong email address, user not found!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const user = await Authentication.findOne({ email: req.body.email });
    console.log("user", user);
    if (user.verification === req.body.code) {
      const updated = await Authentication.updateOne(
        { email: req.body.email },
        { verified: true, verification: null }
      );
      if (updated.acknowledged) {
        return res.status(200).json({
          status: true,
          message: "Verification successfull, please login now",
        });
      }
    } else {
      return res
        .status(401)
        .json({ status: false, error: "Wrong verification code" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await Authentication.findOne({ email: req.body.email });
    if (await bcrypt.compare(req.body.currentPassword, user.password)) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      const updated = await Authentication.updatedOne(
        { email: req.body.email },
        { password: hashedPassword }
      );
      return res.status(200).json({ status: true, user: "Password updated!" });
    } else {
      return res
        .status(401)
        .json({ status: false, error: "Wrong cuurent password!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const resetPasswordEmail = async (req, res) => {
  try {
    const randomNum = Math.floor(100000 + Math.random() * 10000);
    const user = await Authentication.findOne({ email: req.body.email });
    const token = jwt.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: 300 }
    );
    await sendEmail(
      req.body.email,
      token,
      "Password Reset Request",
      user.firstName
    )
      .then((res) => {
        console.log("email", res);
      })
      .catch((err) => console.log("email", err));

    await Authentication.updateOne({ email: req.body.email }, { link: token });

    return res.status(200).json({
      status: true,
      message: "Password reset link sent to your email address",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const verifyResetEmail = async (req, res) => {
  try {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.expiredAt) {
          return res.status(401).json({ status: false, error: "Link expired" });
        } else {
          return res.status(401).json({ status: false, error: "Unauthorised" });
        }
      } else {
        const user = await Authentication.findOne({ email: decoded.email });
        console.log("user", user);
        if (user.link === req.body.token) {
          return res
            .status(200)
            .json({ status: true, message: "verified", user: decoded });
        } else {
          return res.status(401).json({ status: false, error: "Unauthorised" });
        }
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    await Authentication.updateOne(
      { email: req.body.email },
      { password: hashedPassword }
    );
    return res
      .status(200)
      .json({ status: true, message: "Password successfully updated!" });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await Authentication.findOne({ email: req.headers.email });
    return res.status(200).json({ status: true, user });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  const image =
    req.files && req.files.length > 0
      ? req.files[0]?.path?.replaceAll("\\", "/").replace("files/", "")
      : undefined;
  try {
    const user = await Authentication.findOne({ email: req.body.email });
    console.log("user", user);
    let obj = {};
    if (req.body.firstName) {
      obj["firstName"] = req.body.firstName;
    }
    if (req.body.lastName) {
      obj["lastName"] = req.body.lastName;
    }
    if (req.files && req.files.length > 0) {
      obj["image"] = image;
    }

    if (req.body.currentPassword) {
      const verify = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (verify && req.body.newPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        obj["password"] = hashedPassword;
      } else if (!verify) {
        return res
          .status(401)
          .json({ status: false, error: "Wrong current password" });
      } else if (!req.body.newPassword) {
        return res
          .status(401)
          .json({ status: false, error: "Enter new password" });
      }
    } else if (!req.body.currentPassword && req.body.newPassword) {
      return res
        .status(401)
        .json({ status: false, error: "Enter current password" });
    }

    console.log("obj", obj);

    const updated = await Authentication.updateOne(
      { email: req.body.email },
      obj
    );

    if (updated.acknowledged) {
      if (req.files && req.files.length > 0) {
        fs.unlink("files/" + user.image, (err) => {
          if (err) {
            console.log("Delete Error", err);
          } else {
            console.log("File Deleted!");
          }
        });
      }
    }

    return res.status(200).json({ status: true, message: "Profile updated!" });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  updatePassword,
  resetPasswordEmail,
  verifyResetEmail,
  resetPassword,
  getProfile,
  updateProfile,
};
