const express = require('express');
const router = express.Router();
//to make sure the format is correct, I use express validator.
const { check, validationResult } = require('express-validator/check');

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //See if user exists

    //Get users gravatar

    //Encrypt password

    //Return user

    res.send('User was created!!!');
  }
);

module.exports = router;
