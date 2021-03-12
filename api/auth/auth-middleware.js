const User = require("../users/users-model");
const bcrypt = require("bcryptjs");
/*
  If the user does not have a session saved in the server
  status 401 {"message": "You shall not pass!"}
*/
function restricted() {
  return async (req, res, next) => {
    try {
      console.log(req.session, req.session.user);
      if (!req.session && !req.session.user) {
        return res.status(401).json({ message: "You shall not pass!" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

/*
  If the username in req.body already exists in the database
  status 422 {"message": "Username taken"}
*/
function checkUsernameFree() {
  return async (req, res, next) => {
    try {
      const { username } = req.body;
      const user = await User.findBy({ username });
      console.log("user", user);
      if (user) {
        return res.status(422).json({ message: "Username taken." });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
}

/*
  If the username in req.body does NOT exist in the database
  status 401 {"message": "Invalid credentials"}
*/
function checkUsernameExists() {
  return async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.findBy({ username });
      const passwordValid = await bcrypt.compare(password, user.password);

      if (!user || !passwordValid) {
        return res.status(401).json({ message: "Invalid credentials." });
      } else {
        req.session.user = user;
        next();
      }
    } catch (err) {
      next(err);
    }
  };
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter
  status 422 {"message": "Password must be longer than 3 chars"}
*/
function checkPasswordLength() {
  return async (req, res, next) => {
    try {
      const { password } = req.body;
      if (!password || password.length <= 3) {
        return res
          .status(422)
          .json({ message: "Password must be longer than 3 chars" });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
