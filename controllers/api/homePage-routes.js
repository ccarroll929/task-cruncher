const router = require('express').Router();
const { User, Task } = require('../../models');

// GET all tasks for homepage
router.get('/', async (req, res) => {
  try {
    const taskData = await Task.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const tasks = taskData.map((task) => task.get({ plain: true }));

    res.render('homepage', {
      tasks,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Redirect to editTask
router.get('/editTask', async (req, res) => {
  try {
    res.render('editTask', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Redirect to newTask
router.get('/newTask', async (req, res) => {
  try {
    res.render('newTask', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Logout for user and redirect to mainPage.js
router.post('./mainPage-routes.js', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        res.status(404).end();
    }
});


module.exports = router;