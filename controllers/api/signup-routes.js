const router = require('express').Router();
const { User } = require('../../models');

// SignUp for new user
router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Redirect to mainPage after signup
router.get('/signup', async (req, res) => {
  try {
    res.redirect('/mainPage');
  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;