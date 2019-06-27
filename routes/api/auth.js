const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

//importing middleware and using in get request
const auth = require('../../middleware/auth');

//@route GET api/auth
//@desc Test route
//@access Public (to access this api, Token is not required)
router.get('/', auth, async (req, res) => {
  //it went through auth middle ware and now, req.user is decoded. it has user id info.
  try {
    //to leave off password info, I added .select('-password')
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route post api/auth
//@desc Authenticate user & get token. Checking if the user exits in the system or not.
//@access Public (to access this api, Token is not required)

router.post(
  '/',
  [
    check('email', 'Please include a valid email')
      .not()
      .isEmpty(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      //See if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      //below code runs if we find a user by email. Then, we are checking if password is correct or not.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      // we are creating a token. To create a toke, we need payload (user info), secret tied to our app,
      // and optional expiration time. I am sending back a token to user.
      jwt.sign(
        payload,
        config.get('jwtToken'),
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
