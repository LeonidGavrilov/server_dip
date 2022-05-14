import { Schema, model } from "mongoose";
import { IUser } from "../types";

const userModel = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  movies: [{
    type: String,
  }],
  basket: [{
    type: String,
  }],
  avatarUrl: String,
  resetToken: String,
  resetTokenExp: Number,
},
  { versionKey: false });

const User = model("User", userModel);

export default User;