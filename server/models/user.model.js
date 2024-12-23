const mongoose = require("mongoose");
const { APP_URL } = require("../config/app.config");
const { USER_TYPE } = require("../constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: [USER_TYPE.ADMIN, USER_TYPE.USER],
      default: USER_TYPE.USER,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    refreshTokenExpireAt: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    notification: {
      emailNotification: {
        type: Boolean,
        default: false,
      },
      pushNotification: {
        type: Boolean,
        default: false,
      },
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.post("findOne", function (doc) {
  if (doc) {
    doc.profileImage = APP_URL + doc.profileImage;
  }
});

module.exports = mongoose.model("user", userSchema);
