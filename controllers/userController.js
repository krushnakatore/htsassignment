import userSchema from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { comparePassword } from "../authHelpers/authHelper.js";

export const signupController = async (req, res) => {
  try {
    const { first_name, email, last_name, password: pass } = req.body;

    if (!first_name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ error: "Email is Required" });
    }
    if (!pass) {
      return res.send({ error: "Password is Required" });
    }
    if (!last_name) {
      return res.send({ error: "Last Name is Required" });
    }

    const exisitingUser = await userSchema.findOne({ email });
    //if exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: true,
        message: "Already Register please login",
      });
    }

    //hashing the password
    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = await new userSchema({ ...req.body, password: hash }).save();

    //assign unique token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, ...othersData } = user._doc;

    return res
      .status(201)
      .send({ user: othersData, access_token: token, success: true });
  } catch (err) {
    res.status(500).send({ success: false, message: err });
  }
};

export const signinController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    if (!email || !req.body.password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Please Signup before Signin" });
    }
    const match = await comparePassword(req.body.password, user.password);

    if (!match) {
      return res
        .status(404)
        .send({ success: false, message: "Wrong Username or Pasword" });
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, ...othersData } = user._doc;

    res
      .status(200)
      .send({ user: othersData, access_token: token, success: true });
  } catch (err) {
    res.status(500).send({ success: false, message: err });
  }
};
