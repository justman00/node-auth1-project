const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return User.find().exec();
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return User.findOne(filter).exec();
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return User.findById(user_id).exec();
}

/**
  resolves to the newly inserted user { user_id, username }
 */
function add(user) {
  return new User(user).save();
}
function getUsers() {
  return User.find().select("-password").exec();
}
// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = { find, findBy, findById, add, getUsers };
