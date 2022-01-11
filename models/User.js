const { Schema, model } = require("mongoose");
const { Thought } = require(".");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// get total count of friends
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// UserSchema.post(`remove`, (user) => {
//   Thought.remove({ userId: user._id });
// });
// UserSchema.post("remove", function (next) {
//   this.model("Thought").remove({ User_id: this._id }, next);
// });

// UserSchema.post("remove", function (doc) {
//   this.model("Thought").remove({ userId: doc._id });
// });

// create the Users model using the Users Schema
const User = model("User", UserSchema);

// Export Users module
module.exports = User;
