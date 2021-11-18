import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { model, Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
  },
  refreshToken: {
    type: String,
  },
  googleId: {
    type: String,
  },
});

userSchema.pre("save", async function () {
  const newUser = this;
  const plainPW = newUser.password;
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPW, 11);
  }
});
userSchema.methods.toJSON = function () {
  const userDocument = this;
  const userObject = userDocument.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};
userSchema.statics.checkCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email });
  if (user) {
    const isPwdMatch = await bcrypt.compare(plainPW, user.password);
    if (isPwdMatch) return user;
    else return null;
  }
  return null;
};
export default model("user", userSchema);
