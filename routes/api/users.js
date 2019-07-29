const express = require('express');
const router = express.Router();
const config = require('config');
//to make sure the format is correct, I use express validator.
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

//@route post api/users
//@desc Register user
//@access Public (to access this api, Token is not required)
//post request takes 2nd parameter and it is validator function

router.post(
  '/',
  [
    check('name', 'Name is Required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email')
      .not()
      .isEmpty(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      //See if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      //user does not exists. I am constructing a user object to matach with Database Schema
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
      user = new User({
        name,
        email,
        password,
        avatar
      });

      //hasing password using bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //we have to call save() otherwise, user info is not stored in the database.
      //Once it is saved, it returns a promise with id.
      await user.save();

      //NOTE: mongoDB returns _id, but mongoose converts it to non-underscore .id
      const payload = {
        user: {
          id: user.id
        }
      };

      // we are creating a token. To create a toke, we need payload (user info), secret tied to our app,
      // and optional expiration time. I am sending back a token to user.
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
