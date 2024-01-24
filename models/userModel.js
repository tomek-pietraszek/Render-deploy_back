import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  //! You need to add a comfirm password filed in the form on the frontend to be able to use confirmPassword field
  /* 
    passwordConfirm: {
      type: String,
      // required: true,
      validate: {
        validator: function (field) {
          return field === this.password;
        },
      },
    }, 
  */

  avatar: { type: String },

  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update && this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 12);
  }
  next();
});

userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

export default model("User", userSchema);
