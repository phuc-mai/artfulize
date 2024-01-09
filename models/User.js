import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: [true, "username already exist!"],
    required: [true, "Username is required!"],
  },
  email: {
    type: String,
    unique: [true, "Email already exist!"],
    required: [true, "Email is required!"],
  },
  password: {
    type: String,
  },
  profileImagePath: {
    type: String,
  },
  wishlist: {
    type: Array,
    default: [],
  },
  cart: {
    type: Array,
    default: [],
  },
  orderList: {
    type: Array,
    default: [],
  },
  work: {
    type: Array,
    default: [],
  },
});

const User = models.User || model("User", UserSchema);

export default User;
